package com.kazu.scraping.scraping.domain.object;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Post {
    long postNum;
    String userName;
    String date;
    String userId;
    String message;
}
