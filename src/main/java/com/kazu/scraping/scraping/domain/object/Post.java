package com.kazu.scraping.scraping.domain.object;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Post {
    long postNum;
    long threadNum;
    String threadTitle;
    String userName;
    String date;
    String userId;
    String message;
    List<Long> backLinks;
}
