package com.kazu.scraping.scraping.application.resource;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class scrapingBody implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<String> urls;
}
