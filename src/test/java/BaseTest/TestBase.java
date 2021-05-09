package BaseTest;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Date;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.BeforeTest;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;


import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import utili.ExcelReader;
import utili.ExtentManager;
import utili.main_util;

public class TestBase {

	
	public static AndroidDriver driver;
	
	public static Logger log=Logger.getLogger("devpinoyLogger");
	 public static ExcelReader excel=new ExcelReader("./src/test/resources/data/TestdataTwo.xlsx");
	 public static ExtentReports extentReport=ExtentManager.GetExtent(System.getProperty("user.dir")+"/src/test/resources/reports/extent.html");
		public static ThreadLocal<ExtentTest> classLevelLog = new ThreadLocal<ExtentTest>();
		public static ThreadLocal<ExtentTest> testLevelLog = new ThreadLocal<ExtentTest>();
		public static String screenshotPath;
		   public static String Error;
	
	@BeforeSuite
	public void setUp() {

		if(driver==null){
			
			try {
				PropertyConfigurator.configure("./src/test/resources/properties/log4j.properties");
				
			

				main_util.loadConfigProp("app.properties");
				
				log.info("config file loaded");
			
			} catch (IOException e) {
				
				e.printStackTrace();
			}
			main_util.setCapabilities();
			log.info("capabilities loaded");
			try {
				driver = main_util.getDriver();
			} catch (MalformedURLException e) {
				
				e.printStackTrace();
			}
		}
		
	}
	@BeforeClass
	public void beforeClass() {
		
		ExtentTest classLevelTest =extentReport.createTest(getClass().getSimpleName());
		classLevelLog.set(classLevelTest);
		

	}
	
	

	@AfterSuite
	public void tearDown() throws InterruptedException{
		Thread.sleep(2000);
		driver.quit();
		log.info("driver successfully exit");
		
	}
	public static String capture() throws IOException  {
		
		
		Date d = new Date();
		 Error = d.toString().replace(":", "_").replace(" ", "_")+".jpg";
		screenshotPath =System.getProperty("user.dir")+"/src/test/resources/screenshots/"+Error;
			System.out.println("enter the screen shot method....");
			File screenshot = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
		
				File destination = new File(screenshotPath);
			    
			    FileUtils.copyFile(screenshot,destination);
			    

			return screenshotPath;
			

			

	}
	

	
/*	public static void clear(List<MobileElement> ele) {
		ele.clear();
		
	}*/
	

}
