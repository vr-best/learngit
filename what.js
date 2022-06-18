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
// @connect      translate.googleapis.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    /*************************************************************

           ATTENTION:
           All supported languages
           Remove // if you want to include this for translation

    *************************************************************/
    var all_languages = [
        {id:'zh-CN', name:'Chinese Simplified'},
        //{id:'zh-TW', name:'Chinese Traditional'},
        //{id:'af', name:'Afrikaans'},
        //{id:'sq', name:'Albanian'},
        {id:'ar', name:'Arabic'},
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

    var SOURCE_LANGUAGE = 'en',
        TRANSLATED_LANGUAGE = 'es';

    var $ = $ || window.$,
        addListenerInterval = null,
        translateInterval = null,
        translateTimeout = null,
        translate_enabled = true,
        translate_ready = false,
        translate_string = '',
        custom_style = '.language_selected{background-color: #00bfa5;}',
        image_uri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFZklEQVR42sWXe0xTVxzHv5drWXkIKBQfE61Y2DIyR3Sy+FrqRgRF1IFD54IawU03dUE2I3ukxTgqPuYjK6KOZRndnFPYJoEpcUunokNxYnFT4wOQp9A/BshD4N6zc1sKvaWV0C7xhEt/59Hf93N+5/c7uWXwlBtjMV6JeBnz5r0KhmGG/BIhxKYPtLW1Qaf7Aa30c9gA4eFTof+9KJ5l2WzaDRhakIhs+sdT6/T5C5cSFi9JaB82wHsb1iFz5/ZmJ8UFy2Jv9JdN1DoLQGwnrcXWvbsJsYsWmB574n1jan/ZpHSXAU4VFA0CKCj4FaGhCjwXGiJI9s8LY6Ehij4gog4IlLsOkPzORptQiDvEajwmJhqLYqL6AWRjJrsGIDjiOF6kah2Jzs4upKRuwxtLYxE1/3WLcD9A4Nhg5wFsE+7q1Wuoq2tAZKQSUqnUdOaGihvQao8gdcsmKBTBgwDGjJviHMBOTbo40NRhebkBWYe+wpLFMViwYD4d47F7zwF0d3cjbVtq/zprgLHjFcMH2LAhGZmagRywympos47i5s1b2PpRCm78/Q9OnSrCh6mbIZdPtBUHzxP1+AkhrgHY1nl7ewcyd+9Da2sbOjs6sGLFMsydM8ueuCkCzwaFOg9g75Lp6elBru4YSkuvwF3ijqTk1XAPDEdF3TOgmn3AZoDG1hH6kkov/QCY7RGZPBtbKs9/c/v4inbucWsfwPpkUQ5YFldVV+Pb3GMwNhuR8GYcymhSGh7wePTCDirJ2LsJRZ+Dx/vtouritJjGUu1gAGFRVfUDFBf/RqugHMHBcqxKfAsyWQDdJY/ss904V69wRVx4+No/NGz9+Z1iAMuiO3fuQvfdcURHRSIiYroo20+W+yLvuo8r4ia77pyGsQJIgiYjnVg7fdwL3Gtm8fyYHtE5mgF8HYrHvsRhpBQouQPcb4ZDEAGg4UKmGWC9APB5Oken3Czi2wtHoqJ+BD6JbsX0oMf9DgRx4bEnPmEUQXZiL4RXCv0tQFPIOIwC3f0AwPLl8cjO2l9IJxZaxP+qkZhCL2EJPp7fgmlBXaZMF8TzDb52w540h8PicIILdPezFMDKwwxaOuxXBBUfAJBIJMjSfuH12jzlmtzLHgG/XJcq3T39lJaqkDId6u3R9Qj07oXOMFlZUumttBVn3QhykzhanoDuIoNDqwgO64GTVwaLC02IQGPJLth9/5oYd1w1clyY2lsmN/Vr9RlMnT7DZM/57KGKlfqqbRNubghBWgyPT/MZXL4PHHybwENCo5IDel+IxS0ReCIA6+6t9vSfBAHCGmBhRqPqEe+nts32jDgOE0YDiUcYcPSoFk4lSIli8IGOh6FGLG4G2MU8vOgAYErCCRXv5qkWbAHiRb8qhmm6aJpbtHKLqvi2p9o6w8f6EOSs5XGvCbh011xJnu7AshkMzlQQaAo4kbjw0N1TgN32AdIOnJHPnDmbniAm2Zvvpf5+vsbQMjU7XTObR0IEUFHTV8Z96wJ9gNFeQPxBDo+6xFeyANB0yQGAj18AdmQVyuWKsCdCHCsFGlpo8q2jZfUvkPK9OOGm0W/uXcli32kOP5Vxomqg4acAe+DwR8BQEMIR5JURzJhMoF4KaM8S5F8Vh9mNes/bzMLYRrD2aI8Ijoafaf7zCQAWCNX+fPm4oODVljEvb19lpZFRCuI9nKOrVpxw9ubp7ocGsNdSc2pVl2t91a6IC30q7hzAjK0177NSvy9dEafNSBNQZizdO3wARdzXXv5hy36kzqKFY3ZGnPDc+qoTS/I6G8qGD8C4SeAfFg/WY5TpzZ2Y/1l+qgzYZKAcbd+2O+pK0dVkMPsbLsD/3f4DRTYAbJ65vloAAAAASUVORK5CYII=',
        custom_html = '<div class="block-compose tranlate-bottom"><div tabindex="-1" class="input-container" style="padding-top:0px;padding-bottom:0px;padding-left:0px;"><button title="Click for translation help!" class="trans_help_btn" style="float:left"><img alt="Translator" draggable="false" src="' + image_uri + '" style="width:30px;height:30px;padding-left:15px;padding-right:30px;padding-bottom:8px;"></button><div class="input" dir="auto" style="padding-top:6px;"></div></div></div>',
        html_language1 = '<div class="menu-item" style="display:table"><button title="Click for translation help!" class="trans_help_btn"><img alt="Translator" draggable="false" src="data:'+ image_uri +'" style="width:32px;height:32px;"/></button></div>',
        username = '',
        is_debug = true,
        lan_select = '',
        help_url = 'https://greasyfork.org/zh-CN/scripts/28218-translator-for-whatsapp';


    //For menu html
    for(var i=0;i<all_languages.length;i++){
        lan_select = lan_select + '<option value="'+ all_languages[i].id +'">' + all_languages[i].name +'</option>';
    }

    var lan_select_1 = '<span style="padding-left:5px;padding-right:5px;color:green;font-size:10pt;">From:</span><select class="languageSelect1" style="padding-right:5px;width: 126px; text-align-last:center;">' + lan_select + '</select>';
    var lan_select_2 = '<span style="padding-left:20px;padding-right:5px;color:green;font-size:10pt;">To:</span><select class="languageSelect" style="padding-right:5px;width: 126px; text-align-last:center;border-bottom-width: 0px !important;"><option value="off">OFF</option>' + lan_select + '</select>';
    html_language1 = html_language1 + '<div style="display:table;"><div style="display:table-row">'+ lan_select_1 +'</div><div style="display:table-row">'+ lan_select_2 +'</div></div>';

    //Add style
    var customStyleNode = document.createElement('style');
    customStyleNode.textContent = custom_style;
    document.querySelector('head').appendChild(customStyleNode);

    //Replace all function
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    //Show debug
    var debugMessage = function(mes){
        if(is_debug){
            console.info(mes);
        }
    };

    //Show error message
    var showError = function(err){
        alert(err);
        console.error(err);
    };

    //Translate
    //sl - source language
    //dl - target language
    //txt - content to be translated
    //cb - callback after translation
    var translate = function(sl,dl,txt,cb){
        debugMessage('Source:'+ txt);
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sl + "&tl=" + dl +"&dt=t&q=" + encodeURI(txt),
            onload: function(response) {
                //replace the \n
                var _r_text = replaceAll(response.responseText, '\n"', '"');
                var _r = eval(_r_text);
                translate_string = '';
                for(var i=0; i<_r[0].length;i++){
                    translate_string += _r[0][i][0];
                }
                debugMessage('Translation:'+translate_string);
                cb.apply({text: translate_string});
            }
        });
    };

    //Bind to get user input
    var onInput = function(){
        var $_translate_input_1 = $('.tranlate-bottom').find('.input');
        $_translate_input_1.html('Typing...');
        translate_ready = false;
        var _this = $(this);
        delay(function(){
            var _input = $.trim(_this.text());
            if(_input){
                translate(SOURCE_LANGUAGE, TRANSLATED_LANGUAGE, _input, function(){
                    $_translate_input_1.html(this.text);
                    translate_ready = true;
                });
            }else{
                $_translate_input_1.html('');
            }
        }, 1000);
    };

    //Bind to send the translated content
    //Updated: 2018-07-30
    var onEnterKeyPressed = function( event ) {
        if (event.which == 13 && translate_enabled) {
            debugMessage('Waiting translation');
            event.preventDefault();
            var _this = $(this);
            translateInterval = setInterval(function(){
                if(translate_ready){
                    debugMessage('Now sending message:'+translate_string);
                    sendTranslatedMessage(_this, translate_string);
                    debugMessage('Message sent');
                    clearInterval(translateInterval);
                }
            }, 100);
        }
    };

    //Send translated message
    //Updated: 2018-07-31
    var sendTranslatedMessage = function(inputTarget, message){
        translate_string = '';
        inputTarget.focus();
        document.execCommand("selectAll");
        document.execCommand("insertText", false, message);
        if($('footer button:has(span):last span').data('icon') == 'send'){
            $('footer button:has(span):last').click();
        }else{
            showError('Not able to send the translated message');
        }
        translate_ready = false;
    }

    //Add translation bindings
    var addTranslateFunc = function(selectChange){
        if(!username){
            showError('Can not get the username');
            return;
        }

        if(selectChange){
            GM_setValue(username, $('.languageSelect').val());
            GM_setValue(username+'_o', $('.languageSelect1').val());
        }

        TRANSLATED_LANGUAGE = GM_getValue(username) ? GM_getValue(username) : TRANSLATED_LANGUAGE;
        SOURCE_LANGUAGE = GM_getValue(username+'_o') ? GM_getValue(username+'_o') : SOURCE_LANGUAGE;


        //Menu
        debugMessage('Set original language to: ' + SOURCE_LANGUAGE + ', translate to: '+ TRANSLATED_LANGUAGE);
        $('.languageSelect').val(TRANSLATED_LANGUAGE);
        $('.languageSelect1').val(SOURCE_LANGUAGE);

        //Add translation input
        var $_input_body = $('footer div.copyable-text.selectable-text');
        if(TRANSLATED_LANGUAGE !== 'off' && $('.tranlate-bottom').length === 0){
            $('footer').append($(custom_html));
            if($_input_body === null || $_input_body.length !== 1){
                showError('Error binding for Whatsapp translator plugin!');
            }else{
                $_input_body.on('input', onInput)
                    .on('keydown', onEnterKeyPressed);
            }

            //translate sent or received messages
            $('.copyable-area').on('click', '.selectable-text', function(){
                if(TRANSLATED_LANGUAGE!='off'){
                    var $_t_this = $(this);
                    translate('auto', SOURCE_LANGUAGE, $(this).text(), function(){
                        $_t_this.html(this.text);
                    });
                }
            });

            //visit the help page
            $('.trans_help_btn').on('click', function(){
                window.open(help_url,'_blank');
            });
        }else if(TRANSLATED_LANGUAGE === 'off' && $('.tranlate-bottom').length !== 0){
            //remove bindings
            $('.tranlate-bottom').remove();
            $_input_body.off('input', onInput)
                .off('keydown', onEnterKeyPressed);
        }
    };

    //Add listener when user activates a new chat
    addListenerInterval = setInterval(function(){
        var $_div_chat = $('#pane-side');
        //console.log('div_chat_length', $_div_chat.length);
        if($_div_chat.length){

            //console.log('found #pane-side');

            var contacts = document.querySelector('div[role="grid"]').children;
            if(!contacts || contacts.length === 0){
                showError('Not able to get the contacts sidebar');
                return;
            }

            const selector = contacts[0].className.split(' ').join('.');
            console.log('The selector: div.'+selector);

            //更新会经常导致这个地方需要修改
            $('#pane-side').on('click','div.'+selector, function(){

                //Get the username
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
                else{showError('Not able to get the user name');}

                debugMessage('Chat menu clicked');

                //Return if the translation input is added
                if($('.languageSelect').length>0){return;}

                var $header = $('#main header div:first').next();
                if($header.length != 1){showError('Not able to insert translate menu');}
                $header.after($(html_language1));

                //Bind lanaguage select change event
                $('.languageSelect').on('change', function(){
                    addTranslateFunc(true);
                });
                $('.languageSelect1').on('change', function(){
                    addTranslateFunc(true);
                });

                //Apply the translate function
                addTranslateFunc();
            });

            clearInterval(addListenerInterval);
        }
    }, 1000);

    //Delay function
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();
})();