package com.Placify.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestCase {

    private String input;
    private String expectedOutput;
    private boolean isHidden;
}
