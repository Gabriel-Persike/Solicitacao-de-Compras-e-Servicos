function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

	var pIdOrigem,
		pIdDestino,
		pCodcoligada,
		pUsuario = "fluig",
		pPassword = "flu!g@cc#2018",
		pUsuarioRM;
		
	var dataSource = "/jdbc/RM"; //nome da conexão usada no standalone
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
    var myQuery = null;
    
	if (constraints != null)
    {
        for (i = 0; i < constraints.length; i++) 
        {
        	if (constraints[i].fieldName == "pIdOrigem"){ 
        		pIdOrigem = constraints[i].initialValue; 
        	}
        	if (constraints[i].fieldName == "pIdDestino"){ 
        		pIdDestino = constraints[i].initialValue; 
        	}
        	if(constraints[i].fieldName == "pCodcoligada") {
        		pCodcoligada = constraints[i].initialValue; 
        	}
        	if(constraints[i].fieldName == "pUsuarioRM") {
        		pUsuarioRM = constraints[i].initialValue;
        	}	        	
       }
    }
	
	if (constraints == null) {
		return e("Sem parametros");
	}
	 
    try 
	{
    	var conn = ds.getConnection();
		var stmt = conn.createStatement();
		
    	var dataset = DatasetBuilder.newDataset();
		dataset.addColumn("status");
	 	dataset.addColumn("msg");	
    	
    	var dataAtual = new Date();
		var dd = dataAtual.getDate();
		var mm = dataAtual.getMonth()+1; //January is 0!
		var yyyy = dataAtual.getFullYear();
		
		if(dd < 10) {
		   dd = '0'+dd;
		} 
		if(mm < 10) {
		   mm = '0'+mm;
		} 
		
		var today = yyyy + '-' + mm + '-' + dd;
		
		var queryUpdate = "UPDATE tmov SET recmodifiedby = 'fluig', recmodifiedon = '"+today+"', status = 'F' WHERE codcoligada = "+pCodcoligada+" AND idmov = "+pIdOrigem;
		
		var queryInsert = "INSERT INTO TMOVRELAC\
					(IDMOVORIGEM, CODCOLORIGEM, IDMOVDESTINO, CODCOLDESTINO, TIPORELAC, IDPROCESSO, RECCREATEDBY, RECCREATEDON, RECMODIFIEDBY, RECMODIFIEDON, VALORRECEBIDO)\
					VALUES ("+pIdOrigem+","+pCodcoligada+","+pIdDestino+","+pCodcoligada+",'P',0,'fluig','"+today+"','fluig','"+today+"',null)";
		   	 
	 
		log.info("QueryUpdate: " + queryUpdate);
		log.info("QueryInsert: " + queryInsert);

	 	var result = stmt.execute(queryUpdate);
	 	var result2 = stmt.execute(queryInsert);
	 		
	 	dataset.addRow(new Array("true", "Movimento atualizado com sucesso"));	 	  		
	   	 	
	}
	
	catch (e) {		   
	   dataset.addRow(new Array("false",e));
	}
	finally {
	   if(stmt != null) stmt.close();
       if(conn != null) conn.close();   
	}
	   
	return dataset;

}
	

function onMobileSync(user) {

}