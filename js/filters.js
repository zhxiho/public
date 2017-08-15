/*                                                                                                                /*
 * 定义过滤器
 * */
angular.module('xDeskApp')
/*
 *  定义配置服务
 *  提供客户端版本、平台类型、后端服务类型等配置信息
 */
.filter('i18n', ['APPI18N', 'I18nService', function(APPI18N, I18nService) {
    
    return function(str, type) {
        var _type = type;
        if (!type) {
            _type = "label";
        }
        var lang = I18nService.get_lang_async();
        if (APPI18N[lang][_type]) {
            var _result = APPI18N[lang][_type][str];
            return _result?_result:str;
        } else {
            return '';
        }
    };
}])
