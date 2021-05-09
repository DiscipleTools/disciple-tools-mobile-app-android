package testcases;

import org.testng.Assert;
import org.testng.annotations.Test;


import BaseTest.TestBase;
import listeners.TestdataProvider;
import screens.DtLoginScreen;

public class LoginTest extends TestBase{
	
	
	/**
	 * 
	 * @param url
	 * @param username
	 * @param password
	 * 
	 * DATA PROVIDER CLASS , AND THIS TESTCASE TAKE INVALID INPUTS
	 * DATA READ BY EXCELS
	 * @throws InterruptedException 
	 */
	@Test(dataProviderClass=TestdataProvider.class,dataProvider="dp",priority = 1)
	public void LoginInputs(String url,String username,String password) throws InterruptedException {

		DtLoginScreen dt=new DtLoginScreen(driver);
		dt.url(url);
	
		dt.user(username);
		dt.pass(password);
		//dt.eyeButton();
		dt.logInButton();
		/**
		 * This page has a performance issues, it takes to much time too load,
		 * so delaying functions here
		 */
		Thread.sleep(8000);
		
		Assert.assertTrue(dt.isLogin(), "Login is NOT succcessful with valid parameters");
		Thread.sleep(1000);
		dt.tab();
		Thread.sleep(1000);
		dt.signOut();
		//Thread.sleep(3000);
	
//		dt.clear();
		
	}
	
	}
	
