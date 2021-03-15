package com.kazu.scraping.scraping.domain.service;

import java.util.*;

import com.kazu.scraping.scraping.domain.object.Post;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ScrapingService {

    public List<Post> scraping(String url) {
        List<Post> postList = new ArrayList<>();
        Document doc;
        try {
            doc = Jsoup.connect(url).get();
        } catch (IOException e1) {
            log.error("faild to connect. URL: {}", url);
            return null;
        }
        Elements postElements = doc.select(".thread .post");

        for(Element e : postElements){
            Post post = new Post();
            post.setThreadTitle(doc.select(".title").text());
            post.setPostNum(Long.parseLong(e.select(".meta .number").text()));
            post.setDate(e.select(".meta .date").text());
            post.setUserId(e.select(".meta .uid").text());
            post.setUserName(e.select(".meta .name").text());
            post.setMessage(e.select(".message .escaped").text());
            postList.add(post);
        }
        return postList;
    }
}
