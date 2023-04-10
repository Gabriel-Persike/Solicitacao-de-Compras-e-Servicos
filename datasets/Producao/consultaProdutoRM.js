function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
	var newDataset = DatasetBuilder.newDataset();
	var dataSource = "/jdbc/FluigRM";
	var ic = new javax.naming.InitialContext();
	var ds = ic.lookup(dataSource);
	var created = false;
	var i = null;
	var tp = null;
	var myQuery = null;
		if (constraints != null) {
			for (i = 0; i < constraints.length; i++) {
				if (constraints[i].fieldName == "clg") {
					clg = constraints[i].initialValue;
				}
				if (constraints[i].fieldName == "tp") {
					tp = constraints[i].initialValue;
				}
			}
		}
		
		if(clg != null && tp != null){ 
				myQuery = "SELECT DISTINCT\
						TPRODUTO.CODIGOPRD,\
						TPRODUTO.NOMEFANTASIA,\
						TPRODUTO.IDPRD,\
						TPRODUTO.CODCOLPRD,\
						DEF.CODUNDCONTROLE,\
							TPRODUTO.CODIGOPRD + ' - ' + TPRODUTO.NOMEFANTASIA VISUAL,\
							CASE WHEN SUBSTRING(TPRODUTO.CODIGOPRD, 0, 3) = '40' THEN 'Sim'\
							ELSE 'Não'\
							END Codigo,\
							CASE WHEN SUBSTRING(TPRODUTO.CODIGOPRD, 0, 7) = '30.001' OR SUBSTRING(TPRODUTO.CODIGOPRD, 0, 7) = '30.002' OR\
								SUBSTRING(TPRODUTO.CODIGOPRD, 0, 7) = '30.999' OR TPRODUTO.CODIGOPRD IN ('31.999.99999','31.999.99998','31.999.99997','31.999.99994') THEN 'ObjOfficina'\
							ELSE '---'\
							END Ofc,\
						TPRODUTO.TIPO,\
						DEF.NUMDECPRECO as DECIMAIS,\
						DEF.CODTB1FAT\
					FROM\
						TPRODUTO\
							INNER JOIN TPRODUTODEF DEF ON TPRODUTO.IDPRD = DEF.IDPRD AND TPRODUTO.CODCOLPRD = DEF.CODCOLIGADA\
					WHERE\
						TPRODUTO.INATIVO = 0\
						AND TPRODUTO.ULTIMONIVEL = 1\
						AND TPRODUTO.CODCOLPRD = '" + clg + "'\
						AND TPRODUTO.CAMPOLIVRE2 = 'S'\
					ORDER BY TPRODUTO.NOMEFANTASIA";			
	}
		
	try {
		
		var conn = ds.getConnection();
		var stmt = conn.createStatement();
		var rs = stmt.executeQuery(myQuery);
		var columnCount = rs.getMetaData().getColumnCount();
		while (rs.next()) {
			if (!created) {
				for (var i = 1; i <= columnCount; i++) {
					newDataset.addColumn(rs.getMetaData().getColumnName(i));
				}
				created = true;
			}
			var Arr = new Array();
			for (var i = 1; i <= columnCount; i++) {
				var obj = rs.getObject(rs.getMetaData().getColumnName(i));
				if (null != obj) {
					Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
				} else {
					Arr[i - 1] = "---";
				}
			}
			newDataset.addRow(Arr);
		}

	} catch (e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		if (stmt != null) {
			stmt.close();
		}
		if (conn != null) {
			conn.close();
		}
	}
	
	return newDataset;
	
}