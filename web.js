require('app-module-path').addPath('./');

const express = require('express');
const http = require('http');

const config = require('config/config');
const app = express();

const database = require('database');

var mongoose = require('mongoose');
var promise = require('promise');

console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || config.server_port);
const server = http.createServer(app);

function searchPubTransPathAJAX(start_x,start_y,end_x,end_y){
	return new promise(function(fulfill, reject){
		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		var xhr = new XMLHttpRequest();
		var url = `https://api.odsay.com/v1/api/searchPubTransPath?SX=${start_x}&SY=${start_y}&EX=${end_x}&EY=${end_y}&apiKey=TcwVYaSDsWVrQzaBoYuaiF/M4M0j8lA35OT5Dbp1Mn0`;
		xhr.open("GET", url, true);
		xhr.send();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200) {
				var jsonObj = JSON.parse(xhr.responseText);
				fulfill(jsonObj.result['path'][0].info.totalTime);
			}
		}
		
	});
}

function permute(permutation) {
	return new promise(function(fulfill,reject){
		var length = permutation.length,
		result = [permutation.slice()],
        	c = new Array(length).fill(0),
        	i = 1, k, p;

		while (i < length) {
			if (c[i] < i) {
      	 			k = i % 2 && c[i];
      				p = permutation[i];
      				permutation[i] = permutation[k];
      				permutation[k] = p;
      				++c[i];
      				i = 1;
      				result.push(permutation.slice());
    			} 
			else {
      				c[i] = 0;
      				++i;
    			}
  		}
  		fulfill(result);
	});
}

database.init().then(async function(){
	var basket_models = await database.BasketModel.find();
	var place_models = await database.PlaceModel.find({_id:{$in:basket_models[0].places}});
	var start_models = await database.PlaceModel.find({_id:{$in:basket_models[0].start}});
	var end_models = await database.PlaceModel.find({_id:{$in:basket_models[0].end}});
	
	var start_x;
	var start_y;
	var end_x;
	var end_y;
	var map_x = new Array();
	var map_y = new Array();
	
	start_x = start_models[0].map_x;
	start_y = start_models[0].map_y;
	
	end_x = end_models[0].map_x;
	end_y = end_models[0].map_y;
	for(var i =0; i<place_models.length;i++){
		map_x.push(place_models[i].map_x);
		map_y.push(place_models[i].map_y);
	}
	
	var start_index;
	var end_index;
	for(var i =0; i<place_models.length;i++){
		if(map_x[i] == start_x && map_y[i] == start_y)
			start_index = i;
		else if(map_x[i] == end_x && map_y[i] == end_y)
			end_index = i;	
	}

	time = new Array(7);
	
	for (var i = 0; i < time.length; i++) {
		time[i] = new Array(7);
	}
	for(var i=0;i<place_models.length;i++){
		for(var j=0;j<place_models.length;j++){
			if(i==j){
				time[i][j] = 0;
			}

			else{
				time[i][j] = await searchPubTransPathAJAX(map_x[i],map_y[i],map_x[j],map_y[j]);
			}
		}
	}
	
	console.log(time);

	perm_init = new Array();
	perm_final = new Array();

	var j = 0;
	for(var i=0;i<place_models.length;i++){
		if(i==start_index)
			continue;
		else if(i==end_index)
			continue;
		else{
			perm_init[j] = i;
			j++;
		}	
	}

	perm_final = await permute(perm_init);
	
	for(var i=0;i<perm_final.length;i++){
		perm_final[i].push(end_index);
		perm_final[i].unshift(start_index);
	}
	
	var min;
	var min_index;

	for(var i=0;i<perm_final.length;i++){
		var route_time = 0;
		for(var j=0;j<perm_final[i].length-1;j++){
			route_time += time[perm_final[i][j]][perm_final[i][j+1]]		
		}
		if(i==0){
			min = route_time;
		}
		else{
			if(min > route_time){
				min = route_time;
				min_index = i;	
			}
		}
	}
	console.log(min);
	console.log(perm_final[min_index]+ "  end");
});

app.get('/',function(req, res) {
	searchPubTransPathAJAX();
});
server.listen(app.get('port'), () => {
  console.log('Server Start. port: ' + app.get('port'));

});
