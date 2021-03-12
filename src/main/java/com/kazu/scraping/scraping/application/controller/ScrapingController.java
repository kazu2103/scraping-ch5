package com.kazu.scraping.scraping.application.controller;

import java.util.*;

import com.kazu.scraping.scraping.domain.object.Post;
import com.kazu.scraping.scraping.domain.service.ScrapingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class ScrapingController {
    
    @Autowired
    ScrapingService scrapingService;

    @RequestMapping(method=RequestMethod.GET, value="/test")
    public ModelAndView test(ModelAndView mav){
        mav.addObject("msg", "test page");
        mav.setViewName("test");
        return mav;
    }

    @RequestMapping(method=RequestMethod.GET, value="/index")
    public ModelAndView index(ModelAndView mav){
        mav.addObject("msg", "index");
        mav.setViewName("index");
        return mav;
    }

    @RequestMapping(method=RequestMethod.POST, value="/scraping")
    @ResponseBody
    public Map<String, Object> scraping(Model model){
        Map<String, Object> resultMap = new HashMap<>();
        List<Post> postList = scrapingService.scraping();

        resultMap.put("total", postList.size());
        resultMap.put("rows",  postList);
        return resultMap;
    }
}
