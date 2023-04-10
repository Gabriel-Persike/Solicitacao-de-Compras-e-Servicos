//Aprovação de Movimentos - Consulta dados do movimento via consulta SQL
function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

	var newDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigRM"; //nome da conexão usada no standalone
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
    var pIdmov = null;
	var pCodcoligada = null;
	var pSismaRM = null;
    var myQuery = null;
    
    if (constraints != null) 
    {
        for (i = 0; i < constraints.length; i++) {
        	if (constraints[i].fieldName == "pIdmov"){ 
        		pIdmov = constraints[i].initialValue; 
        	}
        	if(constraints[i].fieldName == "pCodcoligada") {
        		pCodcoligada = constraints[i].initialValue; 
        	} 	
        	if(constraints[i].fieldName == "pSismaRM") {
        		pSismaRM = constraints[i].initialValue; 
        	} 
        }
    }	
	

    if (pIdmov != null && pCodcoligada != null && (pSismaRM == null || pSismaRM == false))
    {    	
    	myQuery = "SELECT\
 			titmmov.nseqitmmov RMnumItem,\
			titmmov.precounitario RMprecoUnitario,\
			titmmov.quantidadeoriginal RMquantidade,\
			titmmov.CODUND RMcodUnd,\
			tproduto.descricao RMdescricaoItem,\
			gccusto.nome RMcentroCusto,\
			fcfo.NOMEFANTASIA RMnomefornecedor,\
			titmmovhistorico.historicocurto RMdetalheItem,\
			titmmov.precounitario*titmmov.quantidadeoriginal RMtotalItem,\
 			titmmov.idobjoficina RMprefixo,\
			 ofmodelo.modelo RMmodelo,\
			 tcpg.nome RMcondPagto\
		FROM tmov(NOLOCK)\
			INNER JOIN titmmov(NOLOCK)				ON titmmov.codcoligada = tmov.codcoligada AND titmmov.idmov = tmov.idmov\
			INNER JOIN titmmovratccu(NOLOCK)		ON titmmovratccu.codcoligada = titmmov.codcoligada AND titmmovratccu.idmov = titmmov.idmov AND titmmovratccu.nseqitmmov = titmmov.nseqitmmov\
			INNER JOIN gccusto(NOLOCK)				ON gccusto.codcoligada = titmmovratccu.codcoligada AND gccusto.codccusto = titmmovratccu.codccusto\
			INNER JOIN tproduto(NOLOCK)				ON tproduto.idprd = titmmov.idprd\
			INNER JOIN tcpg(NOLOCK)					ON tcpg.codcpg = tmov.codcpg AND tcpg.codcoligada = tmov.codcoligada\
			INNER JOIN fcfo(NOLOCK)					ON fcfo.codcoligada = tmov.codcolcfo AND fcfo.codcfo = tmov.codcfo\
			INNER JOIN titmmovhistorico(NOLOCK)		ON titmmovhistorico.codcoligada = titmmov.codcoligada AND titmmovhistorico.idmov = titmmov.idmov AND titmmovhistorico.nseqitmmov = titmmov.nseqitmmov\
			LEFT OUTER JOIN ofobjoficina(NOLOCK)	ON ofobjoficina.idobjof = titmmov.idobjoficina AND ofobjoficina.codcoligada = titmmov.codcoligada\
			LEFT OUTER JOIN ofmodelo(NOLOCK)		ON (ofobjoficina.idtipoobj = ofmodelo.idtipoobj and ofobjoficina.codmodelo = ofmodelo.codmodelo)\
		WHERE\
			tmov.codcoligada = "+pCodcoligada+" AND tmov.idmov = "+pIdmov;
    }
    else if (pIdmov != null && pCodcoligada != null && pSismaRM == 'true')
    {
    	myQuery = "SELECT\
    			titmmov.nseqitmmov AS RMnumItem,\
    			titmmov.campolivre AS itemSisma,\
    			tproduto.descricao AS nomeFantasiaPrd,\
    			titmmovhistorico.historicolongo AS descricaoPRD,\
    			titmmov.quantidadeoriginal AS prdQtd,\
    			tprodutodef.codundcompra AS prdMed,\
				tprodutodef.NUMDECPRECO as decimais,\
				tprodutodef.CODTB1FAT,\
    			CONCAT(titmmov.idobjoficina,' - ',ofmodelo.modelo) AS objOfficina,\
    			CASE WHEN (titmmov.idobjoficina IS NOT NULL) THEN 'ObjOfficina'\
    			ELSE '' END AS ofc,\
    			tproduto.codigoprd AS codigoPRD,\
    			tproduto.idprd AS idprd,\
    			titmmovhistorico.historicolongo AS produtoOrc,\
				tproduto.descricao AS codPrdCC,\
				100 AS percentRatCCusto,\
				gccusto.codccusto AS ccustoRat,\
				tproduto.descricao AS prdRatDep,\
				100 AS percentRatDep,\
				titmmovratdep.coddepartamento AS dpRat\
    		FROM tmov(NOLOCK)\
    			INNER JOIN titmmov(NOLOCK)				ON titmmov.codcoligada = tmov.codcoligada AND titmmov.idmov = tmov.idmov\
    			INNER JOIN titmmovratccu(NOLOCK)		ON titmmovratccu.codcoligada = titmmov.codcoligada AND titmmovratccu.idmov = titmmov.idmov AND titmmovratccu.nseqitmmov = titmmov.nseqitmmov\
    			INNER JOIN titmmovratdep(NOLOCK)		ON titmmovratdep.codcoligada = titmmov.codcoligada AND titmmovratdep.idmov = titmmov.idmov AND titmmovratdep.nseqitmmov = titmmov.nseqitmmov\
    			INNER JOIN gccusto(NOLOCK)				ON gccusto.codcoligada = titmmovratccu.codcoligada AND gccusto.codccusto = titmmovratccu.codccusto\
    			INNER JOIN tproduto(NOLOCK)				ON tproduto.idprd = titmmov.idprd AND tproduto.codcolprd = titmmov.codcoligada\
    			INNER JOIN tprodutodef(NOLOCK)			ON tprodutodef.idprd = tproduto.idprd AND tprodutodef.codcoligada = tproduto.codcolprd\
    			INNER JOIN titmmovhistorico(NOLOCK)		ON titmmovhistorico.codcoligada = titmmov.codcoligada AND titmmovhistorico.idmov = titmmov.idmov AND titmmovhistorico.nseqitmmov = titmmov.nseqitmmov\
    			LEFT OUTER JOIN ofobjoficina(NOLOCK)	ON ofobjoficina.idobjof = titmmov.idobjoficina AND ofobjoficina.codcoligada = titmmov.codcoligada\
    			LEFT OUTER JOIN ofmodelo(NOLOCK)		ON (ofobjoficina.idtipoobj = ofmodelo.idtipoobj and ofobjoficina.codmodelo = ofmodelo.codmodelo)\
			WHERE\
				tmov.codcoligada = "+pCodcoligada+" AND tmov.idmov = "+pIdmov;    
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
                    Arr[i - 1] = "     -     ";
                }
            }
            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("ERRO==============> " + e.message);
        newDataset.addColumn("coluna");
        newDataset.addRow("deu erro!");
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