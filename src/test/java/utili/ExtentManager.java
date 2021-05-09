package utili;

import com.aventstack.extentreports.AnalysisStrategy;
import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;

public class ExtentManager {
	private static ExtentReports extent;
	//private static ExtentTest test;
	private static ExtentHtmlReporter htmlReporter;
	//private static String filePath = "./extentreport.html";


	public static ExtentReports GetExtent(String filepath) {
		if (extent != null) {
			return extent;
		} else {
			extent = new ExtentReports();
			extent.attachReporter(getHtmlReporter(filepath));
			extent.setSystemInfo("Host Name", "Emma@Java");
			
			extent.setAnalysisStrategy(AnalysisStrategy.CLASS);
			return extent;
		}
	}

	public static ExtentHtmlReporter getHtmlReporter(String filepath) {

		htmlReporter = new ExtentHtmlReporter(filepath);
		htmlReporter.loadXMLConfig("C:\\Users\\EmmaRoach\\eclipse-workspace\\NewDTApp\\src\\test\\resources\\extentconfig\\ReportsConfig.xml");

		return htmlReporter;
	}
}
