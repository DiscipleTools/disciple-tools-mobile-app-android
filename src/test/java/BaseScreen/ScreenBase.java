package BaseScreen;

import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.appium.java_client.MobileElement;
import io.appium.java_client.TouchAction;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import io.appium.java_client.touch.offset.PointOption;

public class ScreenBase {

	
	public static   AndroidDriver driver;
//	public  static WebDriverWait wait; 

	public ScreenBase(AndroidDriver driver){
		this.driver=driver;
		//wait = new WebDriverWait(driver,30);
		 loadElements();
		
	}
	

	public void loadElements(){
		PageFactory.initElements(new AppiumFieldDecorator(driver), this);	
		
	}
	
	 public static void scroll() {
	   		MobileElement el = (MobileElement) driver
	   			    .findElementByAndroidUIAutomator("new UiScrollable("
	   			        + "new UiSelector().scrollable(true)).scrollIntoView("                      
	   			        + "new UiSelector().textContains(\"Kiswahili\"));");
	       }
	
//	
	 public boolean isElementPresent(MobileElement elementName, int timeout){
     	try{
     	        WebDriverWait wait = new WebDriverWait(driver, timeout);
     	        wait.until(ExpectedConditions.visibilityOf(elementName));
     	        return true;
     	}catch(Exception e){
     	    return false;
     	}
 }
	 public static void tap(int x, int y) {
		   TouchAction action=new TouchAction(driver);
		   action.tap(PointOption.point(x,y)).perform();
		   
		   
	   }
}
