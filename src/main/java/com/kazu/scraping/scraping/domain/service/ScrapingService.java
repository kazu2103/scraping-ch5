package com.kazu.scraping.scraping.domain.service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

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
            post.setThreadNum(Long.parseLong(url.split("/")[url.split("/").length-1].replaceAll("\\.[a-zA-Z]+", "")));
            post.setThreadTitle(doc.select(".title").text());
            post.setPostNum(Long.parseLong(e.select(".meta .number").text()));
            post.setDate(e.select(".meta .date").text());
            post.setUserId(e.select(".meta .uid").text());
            post.setUserName(e.select(".meta .name").text());
            post.setMessage(e.select(".message .escaped").text());
            postList.add(post);
        }

        // 古いレスが新しいレスにアンカーをしている可能性があるため、上記のループとは別で実施する。
        for(Post p : postList){
            searchBackLinks(p.getMessage(), p.getPostNum(), postList);
        }
        return postList;
    }

    private void searchBackLinks(String message, long postNum, List<Post> postList){
        Pattern p = Pattern.compile(">>[0-9]{1,3}");
        Matcher m = p.matcher(message);
        while(m.find()){
            List<Long> backLinks = new ArrayList<>();
            long anchor = Long.parseLong(m.group().substring(2));
            backLinks.add(postNum);
            Post post = postList.stream()
                .filter(pa -> pa.getPostNum() == anchor)
                .collect(Collectors.toList())
                .get(0);
            if (post.getBackLinks() != null && !post.getBackLinks().isEmpty()){
                post.getBackLinks().addAll(backLinks);
            } else{
                post.setBackLinks(backLinks);
            }
        }
    }
}
