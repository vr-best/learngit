$(document).ready(function(){

    // jQuery functions go here 
    console.log("enter onload")


    $.ajax({
        type: "POST",
        // url: "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sl + "&tl=" + dl +"&dt=t&q=" + encodeURI(txt),
        url: "https://api-free.deepl.com/v2/translate?auth_key=61efd09f-2757-e1e3-89c1-3883a7588a35:fx&source_lang=zh&target_lang=en&text="+ encodeURI("你好"),
        success: function(data,txtStatus,jqXHR) {
            //去除 \n
            // var _r_text = replaceAll(response.responseText, '\n"', '"');
            // var _r = eval(_r_text);
            // translate_string = '';
            // for(var i=0; i<_r[0].length;i++){
            //     translate_string += _r[0][i][0];
            // }
                console.log("译文内容是："+ data.translations[0].text)
                translate_string = data.translations[0].text;
 
            // debugMessage('待翻译内容：'+translate_string);
            // debugMessage('离开 translate 函数');
            // cb.apply({text: translate_string});
        }
    });
  
  });

   
