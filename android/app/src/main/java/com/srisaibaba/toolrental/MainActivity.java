package com.srisaibaba.toolrental;

import android.graphics.Color;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        getWindow().setBackgroundDrawableResource(android.R.color.white);
        getWindow().setNavigationBarColor(Color.parseColor("#fdfdff"));
        getWindow().setStatusBarColor(Color.parseColor("#fdfdff"));
        super.onCreate(savedInstanceState);
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().setBackgroundColor(Color.parseColor("#fdfdff"));
        }
    }
}
