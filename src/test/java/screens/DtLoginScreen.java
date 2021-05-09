package screens;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.support.FindAll;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;



import BaseScreen.ScreenBase;
import BaseTest.TestBase;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.AndroidElement;
import io.appium.java_client.pagefactory.AndroidBy;
import io.appium.java_client.pagefactory.AndroidFindAll;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.AndroidFindBys;

public class DtLoginScreen  extends ScreenBase {
	
	

	public DtLoginScreen(AndroidDriver driver) {
		super(driver);
	
	}
	

       @AndroidFindBy(className = "android.widget.EditText")
		public static List<MobileElement> input;
       
       @AndroidFindBy(className = "android.widget.TextView")
		public List<MobileElement> click;
       
       @AndroidFindBy(className = "android.widget.Spinner")
		public MobileElement Spinner;

    @AndroidFindAll({
    	
    	@AndroidBy(id = "tools.disciple.app:id/select_dialog_listview"),
    	@AndroidBy(id = "android:id/text1")
    })
    
    public List<MobileElement> view;

   
       @AndroidFindBy(className = "android.widget.TextView")
     public static List<MobileElement> Toast;
       
       @AndroidFindBy(className = "android.widget.EditText")
       public static MobileElement box;
         
 
    
       /**
        * URL 
        */
       public void url(String data) {
    	   input.get(0).sendKeys(data);
    	   
    	 
    	 
       }
       
       /**
        * USERNAME 
        */
       public void user(String data) {
    	   input.get(1).sendKeys(data);
    		//dataLogs(data);
       }
       
       /**
        * PASSWORD 
        */
       public void pass(String data) {
    	   input.get(2).sendKeys(data);
       }
       
       /**
        * HIDDEN EYE BUTTON
        */
       
       public void eyeButton() {
    	   click.get(6).click();
       }
       
       /**
        * LOGIN BUTTON
        */
       public void logInButton() {
    	   click.get(7).click();
       }
       
//       public void message() {
//    	 System.out.println(  click.get(9).getText());
//       }
       
       /**
        * LOST PASSWORD LINK
        */
      /* public void lostpass() {
    	   click.get(8).click();
       }*/
       
       /**
        * VERSION TEXT
        */
       
     /* public void versionText() {
   	   click.get(9).click();
       }*/
       
    
    /**Validate my login successful or not
     * 
     * 
     */
       
      public boolean isLogin() {
    	  
    	   if (  box.getText().equals("Search")) {
    		   return true;
    	   }
    	   else {
    		   return false;
    	   }
       }
       
      /**
       * Click On settings By Tab Actions
       * 
       */
       public void tab() {
    	   tap(901,1945);
       }
       /**
        * Click On signout By Tab Actions
        * 
        */
       public void signOut() {
    	   tap(732,1261);
       }
       
       
       public  void clear() {
    	   input.get(0).clear();
    	   input.get(1).clear();
    	   input.get(2).clear();
    	   try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
   	}

}

