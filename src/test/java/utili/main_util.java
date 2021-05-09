package utili;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.remote.DesiredCapabilities;


import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.remote.AndroidMobileCapabilityType;
import io.appium.java_client.remote.MobileCapabilityType;

public class main_util {
	
	private static Properties prop = new Properties();
	public static int IMPLICIT_WAIT_TIME;
	public static int EXPLICIT_WAIT_TIME ;
	public static String BASE_PKG;
	public static String APP_ACTIVITY;
    private static String APPIUM_PORT;
	public static String AUTOMATION_INSTRUMENTATION;
	public static String PLATFORM_NAME;
	public static String NEW_COMMAND_TIMEOUT;
	public static String DEVICE_READY_TIMEOUT;
	public static String DEVICE_NAME;
	
	private static DesiredCapabilities capabilities = new DesiredCapabilities();
	private static URL serverUrl;
   // public static ExcelReader excel=new ExcelReader("./src/test/resources/data/Testdata.xlsx");
//	public static ExtentReports extentReport=ExtentManager.GetExtent(System.getProperty("user.dir")+"/src/test/resources/reports/extent.html");
//	public static ThreadLocal<ExtentTest> classLevelLog = new ThreadLocal<ExtentTest>();
//	public static ThreadLocal<ExtentTest> testLevelLog = new ThreadLocal<ExtentTest>();
//	public static String screenshotPath;
//	   public static String Error;
	private static AndroidDriver driver;
	
	
	public static void loadConfigProp(String propertyFileName) throws IOException
	 {
		
		FileInputStream fis = new FileInputStream(System.getProperty("user.dir")+"\\src\\test\\resources\\properties\\"+propertyFileName);
		 prop.load(fis);
		 
		 IMPLICIT_WAIT_TIME = Integer.parseInt(prop.getProperty("implicit.wait"));
		 EXPLICIT_WAIT_TIME = Integer.parseInt(prop.getProperty("explicit.wait"));
		 PLATFORM_NAME=prop.getProperty("platform.name");
		 DEVICE_NAME=prop.getProperty("device.name");
		 APPIUM_PORT = prop.getProperty("appium.server.port");
		 AUTOMATION_INSTRUMENTATION=prop.getProperty("automation.instumentation");
//		 NEW_COMMAND_TIMEOUT=prop.getProperty("new.command.timeout");
//		 DEVICE_READY_TIMEOUT=prop.getProperty("device.ready.timeout");
		 BASE_PKG = prop.getProperty("base.pkg");
		 APP_ACTIVITY = prop.getProperty("application.activity");
		 
		 
		
	 }
	
/*	public static void loadIOSConfProp(String propertyFileName) {
		
		
	}
	
       public static void setIOSCapabilities() {
		
		
		
	}*/
       
       
	public static void setCapabilities() {
		
		capabilities.setCapability(MobileCapabilityType.PLATFORM_NAME,
				main_util.PLATFORM_NAME);
		capabilities.setCapability(MobileCapabilityType.AUTOMATION_NAME,
				main_util.AUTOMATION_INSTRUMENTATION);
		capabilities.setCapability(AndroidMobileCapabilityType.APP_ACTIVITY, main_util.APP_ACTIVITY);
		capabilities.setCapability(AndroidMobileCapabilityType.APP_PACKAGE,main_util.BASE_PKG);
	}
	
	public static AndroidDriver getDriver() throws MalformedURLException {
		serverUrl = new URL("http://localhost:" + APPIUM_PORT + "/wd/hub");		
		driver = new AndroidDriver(serverUrl, capabilities);
		driver.manage().timeouts().implicitlyWait(IMPLICIT_WAIT_TIME, TimeUnit.SECONDS);
		return driver;
	}
	
/*public static AppiumDriver<MobileElement> getIOSDriver() {
		
		
		return driver;
}*/


}
