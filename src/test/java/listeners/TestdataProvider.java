package listeners;

import java.lang.reflect.Method;
import java.util.Hashtable;

import org.testng.annotations.DataProvider;

import BaseTest.TestBase;
import utili.main_util;

public class TestdataProvider extends TestBase{
	
	@DataProvider(name="dp")
	public static Object[][] getData(Method m) {

		String sheetName = m.getName();
		System.out.println(sheetName);
		
		int rowNum = excel.getRowCount(sheetName);
		int colNum = excel.getColumnCount(sheetName);
		
		
		Object[][] data = new Object[rowNum - 1][colNum];

		for (int rows = 2; rows <= rowNum; rows++) {

			for (int cols = 0; cols < colNum; cols++) {

				data[rows - 2][cols] = excel.getCellData(sheetName, cols, rows);

			}

		}

		return data;

	}
	}
	
	

