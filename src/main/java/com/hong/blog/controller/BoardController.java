package com.hong.blog.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hong.blog.model.Board;
import com.hong.blog.service.BoardService;

@Controller
public class BoardController {

	@Autowired
	private BoardService boardService;
	
	// 컨트롤러에서 세션을 어떻게 찾지?
	@GetMapping({"", "/"})
	public String index(Model model, @PageableDefault(size=5, sort="id", direction=Sort.Direction.DESC) Pageable pageable, String search, HttpServletRequest request) {
		Page<Board> boardList;
		if(search == null || search.equals("")) {
			boardList = boardService.글목록(pageable);	
		} else {
			boardList = boardService.글검색목록(pageable, search);
		}
		int nowPage = boardList.getPageable().getPageNumber() + 1; // 현재페이지 : 0 에서 시작하기에 1을 더해준다.
		int firstlistpage = 1;
		int lastlistpage = 10;
		boolean listpagecheckflg = false;
		
		// 페이지 번호 리스트틀 10개씩 출력하도록 한다.
		// 마지막 리스트가 10개 미만일 경우는 남은 번호만 출력하도록 한다.
		while (listpagecheckflg == false) {
			if (boardList.getTotalPages() == 0) {
				lastlistpage = 1;
				listpagecheckflg = true;
			}
			if (lastlistpage > boardList.getTotalPages()) {
				lastlistpage = boardList.getTotalPages();
			}
			if (nowPage >= firstlistpage && nowPage <= lastlistpage) {
				listpagecheckflg = true;
			} else {
				firstlistpage += 10;
				lastlistpage += 10;
			}
		}
		
		// 현재 페이지 번호
		model.addAttribute("nowlistpageno", nowPage);
		// 총 페이지
		model.addAttribute("totalpagesize", boardList.getTotalPages());
		// 페이지 번호 리스트 (첫)
		model.addAttribute("firstlistpage", firstlistpage);
		// 페이지 번호 리스트 (마지막)
		model.addAttribute("lastlistpage", lastlistpage);
		// 페이지, 게시글 정보
		model.addAttribute("boards", boardList);
		
		return "index";
	}
	
	@GetMapping("/board/{id}")
	public String findById(@PathVariable int id, Model model) {
		model.addAttribute("board", boardService.글상세보기(id));
		return "board/detail";
	}
	
	@GetMapping("/board/{id}/updateForm")
	public String updateForm(@PathVariable int id, Model model) {
		model.addAttribute("board", boardService.글상세보기(id));
		return "board/updateForm";
	}
	
	@GetMapping("/board/saveForm")
	public String saveForm() {
		return "board/saveForm";
	}
	
}
