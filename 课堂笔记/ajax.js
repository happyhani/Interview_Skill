function ajax (method, url, data, success) {
  
	var xhr = XMLHttpRequest 
    	? new XMLHttpRequest() 
    	: new ActiveXObject("Microsoft.XMLHTTP");
	var method = method.toUpperCase();
	
	if (method == 'GET' && data) {
		url += '?' + data;
	}
	
	xhr.open(method, url, true);
	if (method == 'GET') {
		xhr.send();
	}
	
	if (method == 'POST') {
	  xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(data);
	}
	
	
	xhr.onreadystatechange = function  () {
		if (xhr.status==200||xhr.status==304) {
			success && success(xhr.responseText);
		}else {
		  alert('出错了：'+xhr.status);
		}
	}
	
}
//只要readyState属性的值由一个值变为另一个值，就会出发一次readyStatechange事件，可以利用这个事件来检测每次状态变化的readyState的值，我们对readyState值为4的阶段感兴趣，因为这时所有数据都已就绪，