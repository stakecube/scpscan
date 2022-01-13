//onclick="download('https://github.com/stakecube/StakeCubeProtocol/releases')"
$('.advanced').click(function(){
	if($('.list').hasClass('d-none')){
		$('.list').removeClass('d-none');
	}
	else{
		$('.list').addClass('d-none');
	}
});

$.getJSON('https://api.github.com/repos/stakecube/StakeCubeProtocol/releases', function(data) {
			var t = '';
			var name = '';
            $.each(data, function( index, release ) {
				name = release.name;
				
				$.each(release.assets, function( index, asset ) {
		            t += '<tr>';
					t += '<td><a href="'+asset.browser_download_url+'" target="_blank">'+name+'</a></td>';
					t += '<td>'+getOS(asset.name)+'</td>';
		            t += '<td>'+getKind(asset.content_type,asset.name)+'</td>';
					t += '<td>'+getArch(asset.name)+'</td>';
		            t += '<td>'+FileSizeConvert(asset.size)+'</td>';
					t += '<td>'+getDate(asset.updated_at)+'</td>';
		            t += '</tr>';
	            });
			});
			
            $('#releasesTable tbody').append(t);
	});
	
	function FileSizeConvert(bytes)
    {
		var result = '';
        bytes = parseFloat(bytes);
        var arBytes = {
            0 : {
                "UNIT" : "TB",
                "VALUE" : Math.pow(1024, 4)
            },
            1 : {
                "UNIT" : "GB",
                "VALUE" : Math.pow(1024, 3)
            },
            2 : {
                "UNIT" : "MB",
                "VALUE" : Math.pow(1024, 2)
            },
            3 : {
                "UNIT" : "KB",
                "VALUE" : 1024
            },
            4 : {
                "UNIT" : "B",
                "VALUE" : 1
            }
        };

		$.each(arBytes, function( index, arItem ) {
            if(bytes >= arItem["VALUE"])
            {
                result = bytes / arItem["VALUE"];
                result = Math.round((result + Number.EPSILON) * 100) / 100;
                result = result.toString();
                //result = result.replace(".", ",")+" "+arItem["UNIT"];
                result = result+" "+arItem["UNIT"];
                return false;
            }
        })
        return result;
    }
    
    function getKind(type, name){
		var kind = '';
		var txts = name.split(".");
		var ext = txts[txts.length - 1];
		switch(type){
			case "application/x-msdownload": kind = 'Installer';
			break;
			case "application/octet-stream": 
				if (ext === 'exe'){
					kind = 'Installer';
				}
				else if(ext === 'sig'){
					kind = 'Signature';
				}
				else{
					kind = 'Signature';
				} 
			break;
			case "application/x-zip-compressed": kind = 'Archive';
			break;
		}
		return kind;
	}
	
	function getOS(name){
		var os = '';
		if (name.indexOf('-win-x64') != -1){
			os = 'Windows';
		}
		else if (name.indexOf('-darwin-x64') != -1){
			os = 'Mac';
		}
		else{
			os = '-';
		}
		return os;
	}
	
	function getArch(name){
		var arch = '';
		if (name.indexOf('x64')){
			arch = '64-bit';
		}
		else if (name.indexOf('x32')){
			arch = '32-bit';
		}
		else{
			arch = '-';
		}
		return arch;
	}
	
	function getDate(date){
		return date.replace('T',' ').replace('Z','');
	}