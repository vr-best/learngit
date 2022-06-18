// window.$ = require('jquery')
window.onload = function(){
    const $ = require('jquery')
    console.log("preload loaded")
    console.log(process.versions.chrome)
    // document.getElementById("s_map").style("display","none")
    console.log("set by id")
    $("#kw").css({"background":"red"})
    console.log("set by jquery")



    // ==UserScript==
// @name         Translator for Whatsapp
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/zh-CN/scripts/28218-translator-for-whatsapp
// @version      2.4.3
// @description  Translator for Whatsapp web
// @author       JedLiu
// @match        https://web.whatsapp.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api-free.deepl.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

// DeepL需要修改：@connect      api-free.deepl.com
// 语言部分修改为：{id:'zh', name:'Chinese'},

    /*************************************************************

           注意:
           下面是所有支持的语言
           如果要将某种语言包含进翻译范围，删除该语言前面的 // 即可

    *************************************************************/
    var all_languages = [
        {id:'zh', name:'Chinese'},
        // {id:'zh-CN', name:'Chinese Simplified'},
        //{id:'zh-TW', name:'Chinese Traditional'},
        //{id:'af', name:'Afrikaans'},
    // {id:'sq', name:'Albanian'},
        // {id:'ar', name:'Arabic'},
        //{id:'hy', name:'Armenian'},
        //{id:'az', name:'Azerbaijani'},
        //{id:'eu', name:'Basque'},
        //{id:'be', name:'Belarusian'},
        //{id:'bn', name:'Bengali'},
        //{id:'bs', name:'Bosnian'},
        //{id:'bg', name:'Bulgarian'},
        //{id:'ca', name:'Catalan'},
        //{id:'ceb', name:'Cebuano'},
        //{id:'ny', name:'Chichewa'},
        //{id:'co', name:'Corsican'},
        //{id:'hr', name:'Croatian'},
        //{id:'cs', name:'Czech'},
        //{id:'da', name:'Danish'},
        //{id:'nl', name:'Dutch'},
        {id:'en', name:'English'},
        //{id:'eo', name:'Esperanto'},
        //{id:'et', name:'Estonian'},
        //{id:'tl', name:'Filipino'},
        //{id:'fi', name:'Finnish'},
        {id:'fr', name:'French'},
        //{id:'fy', name:'Frisian'},
        //{id:'gl', name:'Galician'},
        //{id:'ka', name:'Georgian'},
        {id:'de', name:'German'},
        //{id:'el', name:'Greek'},
        //{id:'gu', name:'Gujarati'},
        //{id:'ht', name:'Haitian Creole'},
        //{id:'ha', name:'Hausa'},
        //{id:'haw', name:'Hawaiian'},
        //{id:'iw', name:'Hebrew'},
        {id:'hi', name:'Hindi'},
        //{id:'hmn', name:'Hmong'},
        //{id:'hu', name:'Hungarian'},
        //{id:'is', name:'Icelandic'},
        //{id:'ig', name:'Igbo'},
        //{id:'id', name:'Indonesian'},
        //{id:'ga', name:'Irish'},
        {id:'it', name:'Italian'},
        {id:'ja', name:'Japanese'},
        //{id:'jw', name:'Javanese'},
        //{id:'kn', name:'Kannada'},
        //{id:'kk', name:'Kazakh'},
        //{id:'km', name:'Khmer'},
        {id:'ko', name:'Korean'},
        //{id:'ku', name:'Kurdish (Kurmanji)'},
        //{id:'ky', name:'Kyrgyz'},
        //{id:'lo', name:'Lao'},
        //{id:'la', name:'Latin'},
        //{id:'lv', name:'Latvian'},
        //{id:'lt', name:'Lithuanian'},
        //{id:'lb', name:'Luxembourgish'},
        //{id:'mk', name:'Macedonian'},
        //{id:'mg', name:'Malagasy'},
        //{id:'ms', name:'Malay'},
        //{id:'ml', name:'Malayalam'},
        //{id:'mt', name:'Maltese'},
        //{id:'mi', name:'Maori'},
        //{id:'mr', name:'Marathi'},
        //{id:'mn', name:'Mongolian'},
        //{id:'my', name:'Myanmar (Burmese)'},
        //{id:'ne', name:'Nepali'},
        //{id:'no', name:'Norwegian'},
        //{id:'ps', name:'Pashto'},
        //{id:'fa', name:'Persian'},
        //{id:'pl', name:'Polish'},
        {id:'pt', name:'Portuguese'},
        //{id:'ma', name:'Punjabi'},
        //{id:'ro', name:'Romanian'},
        {id:'ru', name:'Russian'},
        //{id:'sm', name:'Samoan'},
        //{id:'gd', name:'Scots Gaelic'},
        //{id:'sr', name:'Serbian'},
        //{id:'st', name:'Sesotho'},
        //{id:'sn', name:'Shona'},
        //{id:'sd', name:'Sindhi'},
        //{id:'si', name:'Sinhala'},
        //{id:'sk', name:'Slovak'},
        //{id:'sl', name:'Slovenian'},
        //{id:'so', name:'Somali'},
        {id:'es', name:'Spanish'},
        //{id:'su', name:'Sudanese'},
        //{id:'sw', name:'Swahili'},
        //{id:'sv', name:'Swedish'},
        //{id:'tg', name:'Tajik'},
        //{id:'ta', name:'Tamil'},
        //{id:'te', name:'Telugu'},
        //{id:'th', name:'Thai'},
        //{id:'tr', name:'Turkish'},
        //{id:'uk', name:'Ukrainian'},
        //{id:'ur', name:'Urdu'},
        //{id:'uz', name:'Uzbek'},
        {id:'vi', name:'Vietnamese'},
        //{id:'cy', name:'Welsh'},
        //{id:'xh', name:'Xhosa'},
        //{id:'yi', name:'Yiddish'},
        //{id:'yo', name:'Yoruba'},
        //{id:'zu', name:'Zulu'}
    ];

    var SOURCE_LANGUAGE = 'zh',
        TRANSLATED_LANGUAGE = 'en';

    // var $ = $ || window.$,
    var addListenerInterval = null,
        translateInterval = null,
        translateTimeout = null,
        translate_enabled = true,
        translate_ready = false,
        translate_string = '',
        custom_style = '.language_selected{background-color: #00bfa5;}',
        image_uri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFZklEQVR42sWXe0xTVxzHv5drWXkIKBQfE61Y2DIyR3Sy+FrqRgRF1IFD54IawU03dUE2I3ukxTgqPuYjK6KOZRndnFPYJoEpcUunokNxYnFT4wOQp9A/BshD4N6zc1sKvaWV0C7xhEt/59Hf93N+5/c7uWXwlBtjMV6JeBnz5r0KhmGG/BIhxKYPtLW1Qaf7Aa30c9gA4eFTof+9KJ5l2WzaDRhakIhs+sdT6/T5C5cSFi9JaB82wHsb1iFz5/ZmJ8UFy2Jv9JdN1DoLQGwnrcXWvbsJsYsWmB574n1jan/ZpHSXAU4VFA0CKCj4FaGhCjwXGiJI9s8LY6Ehij4gog4IlLsOkPzORptQiDvEajwmJhqLYqL6AWRjJrsGIDjiOF6kah2Jzs4upKRuwxtLYxE1/3WLcD9A4Nhg5wFsE+7q1Wuoq2tAZKQSUqnUdOaGihvQao8gdcsmKBTBgwDGjJviHMBOTbo40NRhebkBWYe+wpLFMViwYD4d47F7zwF0d3cjbVtq/zprgLHjFcMH2LAhGZmagRywympos47i5s1b2PpRCm78/Q9OnSrCh6mbIZdPtBUHzxP1+AkhrgHY1nl7ewcyd+9Da2sbOjs6sGLFMsydM8ueuCkCzwaFOg9g75Lp6elBru4YSkuvwF3ijqTk1XAPDEdF3TOgmn3AZoDG1hH6kkov/QCY7RGZPBtbKs9/c/v4inbucWsfwPpkUQ5YFldVV+Pb3GMwNhuR8GYcymhSGh7wePTCDirJ2LsJRZ+Dx/vtouritJjGUu1gAGFRVfUDFBf/RqugHMHBcqxKfAsyWQDdJY/ss904V69wRVx4+No/NGz9+Z1iAMuiO3fuQvfdcURHRSIiYroo20+W+yLvuo8r4ia77pyGsQJIgiYjnVg7fdwL3Gtm8fyYHtE5mgF8HYrHvsRhpBQouQPcb4ZDEAGg4UKmGWC9APB5Oken3Czi2wtHoqJ+BD6JbsX0oMf9DgRx4bEnPmEUQXZiL4RXCv0tQFPIOIwC3f0AwPLl8cjO2l9IJxZaxP+qkZhCL2EJPp7fgmlBXaZMF8TzDb52w540h8PicIILdPezFMDKwwxaOuxXBBUfAJBIJMjSfuH12jzlmtzLHgG/XJcq3T39lJaqkDId6u3R9Qj07oXOMFlZUumttBVn3QhykzhanoDuIoNDqwgO64GTVwaLC02IQGPJLth9/5oYd1w1clyY2lsmN/Vr9RlMnT7DZM/57KGKlfqqbRNubghBWgyPT/MZXL4PHHybwENCo5IDel+IxS0ReCIA6+6t9vSfBAHCGmBhRqPqEe+nts32jDgOE0YDiUcYcPSoFk4lSIli8IGOh6FGLG4G2MU8vOgAYErCCRXv5qkWbAHiRb8qhmm6aJpbtHKLqvi2p9o6w8f6EOSs5XGvCbh011xJnu7AshkMzlQQaAo4kbjw0N1TgN32AdIOnJHPnDmbniAm2Zvvpf5+vsbQMjU7XTObR0IEUFHTV8Z96wJ9gNFeQPxBDo+6xFeyANB0yQGAj18AdmQVyuWKsCdCHCsFGlpo8q2jZfUvkPK9OOGm0W/uXcli32kOP5Vxomqg4acAe+DwR8BQEMIR5JURzJhMoF4KaM8S5F8Vh9mNes/bzMLYRrD2aI8Ijoafaf7zCQAWCNX+fPm4oODVljEvb19lpZFRCuI9nKOrVpxw9ubp7ocGsNdSc2pVl2t91a6IC30q7hzAjK0177NSvy9dEafNSBNQZizdO3wARdzXXv5hy36kzqKFY3ZGnPDc+qoTS/I6G8qGD8C4SeAfFg/WY5TpzZ2Y/1l+qgzYZKAcbd+2O+pK0dVkMPsbLsD/3f4DRTYAbJ65vloAAAAASUVORK5CYII=',
        custom_html = '<div class="block-compose tranlate-bottom"><div tabindex="-1" class="input-container" style="padding-top:0px;padding-bottom:0px;padding-left:0px;"><button title="单击获取帮助！" class="trans_help_btn" style="float:left"><img alt="Translator" draggable="false" src="' + image_uri + '" style="width:30px;height:30px;padding-left:15px;padding-right:30px;padding-bottom:8px;"></button><div class="input" dir="auto" style="padding-top:6px;"></div></div></div>',
        html_language1 = '<div class="menu-item" style="display:table"><button title="单击获取帮助！" class="trans_help_btn"><img alt="Translator" draggable="false" src="data:'+ image_uri +'" style="width:32px;height:32px;"/></button></div>',
        username = '',
        is_debug = true,
        lan_select = '',
        help_url = 'https://greasyfork.org/zh-CN/scripts/28218-translator-for-whatsapp';


    // 生成 菜单 html
    for(var i=0;i<all_languages.length;i++){
        lan_select = lan_select + '<option value="'+ all_languages[i].id +'">' + all_languages[i].name +'</option>';
    }

    var lan_select_1 = '<span style="padding-left:5px;padding-right:5px;color:green;font-size:10pt;">From:</span><select class="languageSelect1" style="padding-right:5px;width: 126px; text-align-last:center;">' + lan_select + '</select>';
    var lan_select_2 = '<span style="padding-left:20px;padding-right:5px;color:green;font-size:10pt;">To:</span><select class="languageSelect" style="padding-right:5px;width: 126px; text-align-last:center;border-bottom-width: 0px !important;"><option value="off">OFF</option>' + lan_select + '</select>';
    html_language1 = html_language1 + '<div style="display:table;"><div style="display:table-row">'+ lan_select_1 +'</div><div style="display:table-row">'+ lan_select_2 +'</div></div>';

    //插入 style 样式
    var customStyleNode = document.createElement('style');
    customStyleNode.textContent = custom_style;
    document.querySelector('head').appendChild(customStyleNode);

    //替换所有函数
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    //显示 debug 信息
    var debugMessage = function(mes){
        if(is_debug){
            console.info(mes);
        }
    };

    //显示 error 消息
    var showError = function(err){
        alert(err);
        console.error(err);
    };

    //translate 翻译函数
    //sl - source language
    //dl - target language
    //txt - 待翻译内容
    //cb - 翻译后回调
    var translate = function(sl,dl,txt,cb){
        debugMessage('进入 translate 函数');
        debugMessage('原文:'+ txt);
        $.ajax({
            type: "POST",
            // url: "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sl + "&tl=" + dl +"&dt=t&q=" + encodeURI(txt),
            url: "https://api-free.deepl.com/v2/translate?auth_key=61efd09f-2757-e1e3-89c1-3883a7588a35:fx&source_lang="+ sl +"&target_lang="+ dl +"&text="+ encodeURI(txt),
            success: function(data,txtStatus,jqXHR) {
                //去除 \n
                // var _r_text = replaceAll(response.responseText, '\n"', '"');
                // var _r = eval(_r_text);
                // translate_string = '';
                // for(var i=0; i<_r[0].length;i++){
                //     translate_string += _r[0][i][0];
                // }

                translate_string = data.translations[0].text;
                debugMessage('译文内容：'+translate_string);
                debugMessage('离开 translate 函数');
                cb.apply({text: translate_string});
            }
        });
    };

    //绑定元素，以获取用户输入
    var onInput = function(){
        var $_translate_input_1 = $('.tranlate-bottom').find('.input');
        $_translate_input_1.html('正在输入...');
        translate_ready = false;
        // var _this = $(this);
        // delay(function(){
        //     var _input = $.trim(_this.text());
        //     if(_input){
        //         translate(SOURCE_LANGUAGE, TRANSLATED_LANGUAGE, _input, function(){
        //             $_translate_input_1.html(this.text);
        //             translate_ready = true;
        //         });
        //     }else{
        //         $_translate_input_1.html('');
        //     }
        // }, 1000);
    };

    //绑定元素，以发送翻译好的内容（xyx++ 按下回车键发送消息）
    //Updated: 2018-07-30
    var onEnterKeyPressed = function( event ) {
        if (event.which == 13 && translate_enabled) {

            var $_translate_input_1 = $('.tranlate-bottom').find('.input');
            $_translate_input_1.html('正在输入...');
            var _this = $(this);           
            var _input = $.trim(_this.text());
            if(_input){
                translate(SOURCE_LANGUAGE, TRANSLATED_LANGUAGE, _input, function(){
                    $_translate_input_1.html(this.text);
                    translate_ready = true;
                });
            }else{
                $_translate_input_1.html('');
            }   



            debugMessage('按了Enter键，翻译完毕');
            event.preventDefault();
            // var _this = $(this);
            translateInterval = setInterval(function(){
                if(translate_ready){
                    debugMessage('正在发送消息：'+translate_string);
                    sendTranslatedMessage(_this, translate_string);
                    debugMessage('消息发送成功！');
                    clearInterval(translateInterval);
                }
            }, 100);
        }
    };

    // 发送翻译好的消息
    //Updated: 2018-07-31
    var sendTranslatedMessage = function(inputTarget, message){
        translate_string = '';
        inputTarget.focus();
        document.execCommand("selectAll");
        document.execCommand("insertText", false, message);
        if($('footer button:has(span):last span').data('icon') == 'send'){
            $('footer button:has(span):last').click();
        }else{
            showError('无法发送翻译好的消息！');
        }
        translate_ready = false;
    };

    // 添加翻译绑定
    var addTranslateFunc = function(selectChange){
        if(!username){
            showError('无法获取 username');
            return;
        }

        if(selectChange){
            GM_setValue(username, $('.languageSelect').val());
            GM_setValue(username+'_o', $('.languageSelect1').val());
        }

        TRANSLATED_LANGUAGE = GM_getValue(username) ? GM_getValue(username) : TRANSLATED_LANGUAGE;
        SOURCE_LANGUAGE = GM_getValue(username+'_o') ? GM_getValue(username+'_o') : SOURCE_LANGUAGE;


        // 菜单 Menu
        debugMessage('原语言：' + SOURCE_LANGUAGE + ', 目标语言：'+ TRANSLATED_LANGUAGE);
        $('.languageSelect').val(TRANSLATED_LANGUAGE);
        $('.languageSelect1').val(SOURCE_LANGUAGE);

        // 添加翻译 input 控件
        var $_input_body = $('footer div.copyable-text.selectable-text');
        if(TRANSLATED_LANGUAGE !== 'off' && $('.tranlate-bottom').length === 0){
            $('footer').append($(custom_html));
            if($_input_body === null || $_input_body.length !== 1){
                showError('Whatsapp 翻译器插件绑定错误！');
            }else{
                $_input_body.on('input', onInput)
                    .on('keydown', onEnterKeyPressed);
            }

            // 翻译已发送或之前接收到的消息
            $('.copyable-area').on('click', '.selectable-text', function(){
                if(TRANSLATED_LANGUAGE!='off'){
                    var $_t_this = $(this);
                    translate('en', SOURCE_LANGUAGE, $(this).text(), function(){ // 使用 DeepL 时 第一个参数留空表示自动检测语言
                        $_t_this.html(this.text);
                    });
                }
            });

            // 访问帮助页面
            $('.trans_help_btn').on('click', function(){
                window.open(help_url,'_blank');
            });
        }else if(TRANSLATED_LANGUAGE === 'off' && $('.tranlate-bottom').length !== 0){
            // 移除绑定
            $('.tranlate-bottom').remove();
            $_input_body.off('input', onInput)
                .off('keydown', onEnterKeyPressed);
        }
    };

    // 当用户激活一个新聊天窗口时增加一个监听器
    addListenerInterval = setInterval(function(){
        var $_div_chat = $('#pane-side');
        //console.log('div_chat_length', $_div_chat.length);
        if($_div_chat.length){

            //console.log('found #pane-side');

            var contacts = document.querySelector('div[role="grid"]').children;
            if(!contacts || contacts.length === 0){
                showError('无法获取联系人侧边栏！');
                return;
            }

            const selector = contacts[0].className.split(' ').join('.');
            console.log('选择器: div.'+selector);

            //更新会经常导致这个地方需要修改
            $('#pane-side').on('click','div.'+selector, function(){

                // 获取 username
                //username = escape($(this).find('.chat-title').text());
                console.info($(this));
                var _tusername = '';
                $(this).find('span').each(function(i,x){
                    if(x.hasAttribute('title')) {
                        //console.info(x.title);
                        _tusername = x.title;
                        return false;
                    }
                });
                if(_tusername !== ''){username = escape(_tusername);}
                else{showError('无法获取用户名！');}

                debugMessage('单击了聊天菜单！');

                // 添加了翻译输入控件后返回
                if($('.languageSelect').length>0){return;}

                var $header = $('#main header div:first').next();
                if($header.length != 1){showError('无法插入翻译菜单');}
                $header.after($(html_language1));

                // 绑定语言选择的 change 事件
                $('.languageSelect').on('change', function(){
                    addTranslateFunc(true);
                });
                $('.languageSelect1').on('change', function(){
                    addTranslateFunc(true);
                });

                // 应用 translate 函数
                addTranslateFunc();
            });

            clearInterval(addListenerInterval);
        }
    }, 1000);

    // delay 函数
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

}