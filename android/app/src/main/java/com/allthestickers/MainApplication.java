package com.allthestickers;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cl.json.RNSharePackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.benjamin.rnimagetools.ImageToolsPackage;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import cl.json.ShareApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication, ShareApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSharePackage(),
            new RNViewShotPackage(),
            new ImageToolsPackage(),
            new ImagePickerPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAnalyticsPackage(),
            new VectorIconsPackage(),
            new RCTCameraPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public String getFileProviderAuthority() {
      return "com.allthestickers.provider";
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
