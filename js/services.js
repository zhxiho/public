/*                                                                                                                /*
 * 定义各个功能的服务
 * */
angular.module('xDeskApp')
/*
 *  定义配置服务
 *  提供客户端版本、平台类型、后端服务类型等配置信息
 */
.factory('ConfigService', [function() {
    var config = _app_config_;
    if (config.service_type === 'node') {
        Notification.requestPermission();
	}
	
    return {
        get: function(key) {
            if (key === 'version') {
                return config.version;
            } else if (key === 'platform') {
                return config.platform;
            } else if (key === 'service_type') {
                return config.service_type;
            } else if (key === 'settings') {
                return config.settings;
            } else if (key === 'hide_hot_key') {
				return [config.hide_hot_key, config.hide_keys];
			} else if (key === 'qlogin_status') {
                return config.qlogin_status;
			} else if (key === 'shutoff_and_reboot') {
                return config.shutoff_and_reboot;
            } else if (key === 'default_langue') {
                return config.default_langue;
            } else if (key === 'security_password_required') {
                return config.security_password_required;
            } else if (key === 'multip_protcl') {
                return config.multip_protcl;
            }
        },
        enable_developer_options: function() {
            config.settings.list = config.settings.list.map(function(item) {
                if (item.title === 'system_settings') {
                    item.list = item.list.map(function(_item) {
                        if (_item.title === 'developer_options') {
                            _item.status = !_item.status;
                        }
                        return _item;
                    });
                }
                return item;
            });
        }
    };
}])
/* 
 * 热键服务
 * 提供热键的隐藏和取消服务
 * */
.factory('ShortcutKeyService', ['$q', 'ConfigService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, NotifyService, APP_NOTIFY) {
    if (ConfigService.get('service_type') === 'node') {
        return {
            hide: function() {
                var defer1 = $q.defer();
                if (ConfigService.get('hide_hot_key') === true) {
                    require('../node/hide_key').hide_hot_key(ConfigService.get('hide_keys'), function(error) {
                        if (error !== null) {
                            defer1.reject(error);
                        } else {
                            defer1.resolve();
                        }
                    });
                    /*require('../node/system').regist_exit();*/
                } else {
                    defer1.resolve();
                }
                return defer1.promise;
            },
            exit: function() {
                var defer1 = $q.defer();
                require('../node/hide_key').exit_hide_key(function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        return {
            hide: function() {
                var defer1 = $q.defer();
                defer1.resolve();
                return defer1.promise;
            },
            exit: function() {
                var defer1 = $q.defer();
                defer1.resolve();
                return defer1.promise;
            }
        };
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
}])
/*
 * 接入网关服务
 * 提供获取和修改接入网关地址服务
 * */
.factory('AgService', ['$q', 'ConfigService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, NotifyService, APP_NOTIFY) {
    var ag_status = {
        'main_ag': {'address': '', 'status': false, 'done': false, 'proxy':false},
        'reserve_ag': {'address': '', 'status': false, 'done': false, 'proxy':false}
    };
    
    if (ConfigService.get('service_type') === 'node') {
        return {
            get_active_ag: function() {
                var defer1 = $q.defer();
                if (ag_status.main_ag.status === true) {
                    defer1.resolve(ag_status.main_ag);
                } else if (ag_status.reserve_ag.status === true) {
                    defer1.resolve(ag_status.reserve_ag);
                } else {
                    defer1.resolve({address:null, proxy: false});
                }
                return defer1.promise;
            },
            set_status: function(key, status) {
                if (key === 'main') {
                    ag_status.main_ag.status = status;
                } else if (key === 'reserve') {
                    ag_status.reserve_ag.status = status;
                }
            },
            get: function(key) {
                var defer1 = $q.defer();
                if (ag_status[key].done === true) {
                    defer1.resolve(ag_status[key]);
                } else {
                    require("../node/ag").get(key, function(error, data) {
                        if (error !== null) {
                            defer1.reject(error);
                        } else {
                            ag_status[key] = data;
                            ag_status[key].done = true;
                            defer1.resolve(data);
                        }
                    });
                }
                return defer1.promise;
            },
            set: function(key, value, proxy) {
                var defer1 = $q.defer();
                require("../node/ag").set(key, value, proxy, function(error) {
                    if (error !== null) {
                        defer1.reject();
                    } else {
                        ag_status[key].address = value;
                        ag_status[key].proxy = proxy;
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端的实现
        return {
            get: function(key) {
                var defer1 = $q.defer();
                if (ag_status[key].done === true) {
                    defer1.resolve(ag_status[key]);
                } else {
                    var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                    _utils.readFile("/sdcard/xview/data/ag.conf.json", function(error, data) {
                        if (error !== null) {
                            defer1.reject(error);
                        } else {
                            if (data !== null) {
                                var _ag = JSON.parse(data)[key];
                                ag_status[key] = _ag;
                                ag_status[key].done = true;
                                defer1.resolve(_ag);
                            } else {
                                _utils.readConf("www/etc/ag.conf.json", function(error, data) {
                                    if (error !== null) {
                                        defer1.reject(error);
                                    } else {
                                        var _ag = JSON.parse(data)[key];
                                        ag_status[key] = _ag;
                                        ag_status[key].done = true;
                                        defer1.resolve(_ag);
                                    }
                                });
                            }
                        }
                    });
                }
                return defer1.promise;
            },
            get_active_ag: function() {
                var defer1 = $q.defer();
                if (ag_status.main_ag.status === true) {
                    defer1.resolve(ag_status.main_ag);
                } else if (ag_status.reserve_ag.status === true) {
                    defer1.resolve(ag_status.reserve_ag);
                } else {
                    defer1.resolve({address:null, proxy:false});
                }
                return defer1.promise;
            },
            set_status: function(key, status) {
                if (key === 'main') {
                    ag_status.main_ag.status = status;
                } else if (key === 'reserve') {
                    ag_status.reserve_ag.status = status;
                }
            },
            set: function(key, value, proxy) {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                var write_ag = {'main_ag':{address:ag_status.main_ag.address ,proxy:ag_status.main_ag.proxy}, 'reserve_ag': {address:ag_status.reserve_ag.address ,proxy:ag_status.reserve_ag.proxy}};
                write_ag[key].address = value;
                write_ag[key].proxy = proxy;
                _utils.writeFile("/sdcard/xview/data/ag.conf.json", JSON.stringify(write_ag), function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        ag_status[key].address = value;
                        ag_status[key].proxy = proxy;
                        defer1.resolve();
                    }

                });
                return defer1.promise;
            }
        }
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
   
}])
/*
 * 网络服务
 * 提供ping、获取网关、设置IP等网络相关服务
 * */
.factory('NetworkService', ['$q', 'ConfigService', 'AgService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, AgService, NotifyService, APP_NOTIFY) {
    var interval_id = null;
    var INTERVAL_MS = 15000;
    var PING_TIMES = 3;
    
    var process_pid = null;
    
    var default_gateway = '';
    var gateway_done = false;
    var local_ip = {address: '', mac: ''};
    var local_ip_done = false;
    
    if (ConfigService.get('service_type') === 'node') {
        /*require("../node/network").get_default_gateway(function(error, data) {
            if (error !== null) {
                // 获取网关出错
                // 给出出错消息提示
                NotifyService.show(APP_NOTIFY.network.gatewayGet.error);
            } else {
                default_gateway = data;
                gateway_done = true;
            }
        });*/
        
        return {
            get_local_ip: function() {
                var defer1 = $q.defer();
                if (local_ip_done === true) {
                    defer1.resolve(local_ip);
                } else {
                    local_ip = require("../node/network").get_local_ip();
                    local_ip_done = true;
                    defer1.resolve(local_ip);
                }
                return defer1.promise;
            },
            get_default_gateway: function() {
                var defer1 = $q.defer();
                if (gateway_done === true) {
                    defer1.resolve(default_gateway);
                } else {
                    require("../node/network").get_default_gateway(function(error, data) {
                        if (error !== null) {
                            // 获取网关出错
                            defer1.reject(error);
                        } else {
                            default_gateway = data;
                            gateway_done = true;
                            defer1.resolve(default_gateway);
                        }
                    });
                }
                return defer1.promise;
            },
            ping: function(dst, times) {
                var defer1 = $q.defer();
                require("../node/network").ping(dst, times, function(error, result) {
                    if (error !== null) {
                        defer1.resolve(false);
                    } else {
                        defer1.resolve(result);
                    }
                });
                return defer1.promise;
            },
            dn_ping: function(dst, times, callback) {
                var defer1 = $q.defer();
                process_pid = require('../node/network').dn_ping(dst, times, function(error, result) {
                    if (error !== null) {
                        if (error.code === 4041) {
                            defer1.resolve();
                        } else if (error.code == 4042) {
                            defer1.reject();
                        }
                    } else {
                        defer1.notify(result);
                    }
                });
                return defer1.promise;
            },
            dn_traceroute: function(dst, callback) {
                var defer1 = $q.defer();
                process_pid = require('../node/network').dn_traceroute(dst, function(error, result) {
                    if (error !== null) {
                        if (error.code === 4041) {
                            defer1.resolve();
                        } else if (error.code == 4042) {
                            defer1.reject();
                        }
                    } else {
                        defer1.notify(result);
                    }
                });
                return defer1.promise;
            },
            process_stop: function() {
                var defer1 = $q.defer();
                require("../node/system").kill(process_pid, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            get_mode: function() {
                var defer1 = $q.defer();
                require("../node/network").get_mode(function(error, mode) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(mode);
                    }
                });
                return defer1.promise;
            },
            set_mode: function(mode) {
                var defer1 = $q.defer();
                require("../node/network").set_mode(mode, function(error, data) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            network_status: function() {
                var defer1 = $q.defer();
                require("../node/network").network_status(function(error, data) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(data);
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端的实现
        return {
            get_default_gateway: function() {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.netInfo(function(error, data) {
                    if (error !== null) {
                        // 获取网络信息失败
                        defer1.reject(error);
                    } else {
                        var _net_info = JSON.parse(data);
                        default_gateway = _net_info.GateWay;
                        gateway_done = true;
                        defer1.resolve(default_gateway);
                    }
                });
                return defer1.promise;
            },
            ping: function(dst, times) {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.ping(dst, function(error, result) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(result);
                    }
                });
                return defer1.promise;
            },
            get_local_ip: function() {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.netInfo(function(error, data) {
                    if (error !== null) {
                        // 获取网络信息失败
                        defer1.reject(error);
                    } else {
                        var _net_info = JSON.parse(data);
                        local_ip = {address: _net_info.IP, mac: _net_info.MAC};
                        local_ip_done = true;
                        defer1.resolve(local_ip);
                    }
                });
                return defer1.promise;
            },
            network_status: function() {
                var defer1 = $q.defer();
                var _settings_utils = cordova.require("cordova-plugin-dialog.SettingsUtil");
                _settings_utils.network_status(function(error, data) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        var _network_status = JSON.parse(data);
                        defer1.resolve(_network_status.conn);
                    }
                });
                return defer1.promise;
            }
        };
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
    
}])
/*
 * 资源列表服务
 * 在不同视图间提供用户获取到的资源列表
 * 在用户登录后会进行刷新
 * */
.factory('ResourcesListService', [function() {
    var list = {};
    var connect_type = 'spice';
    return {
        get: function() {
            return list;
        },
        init: function(_list) {
            list = _list;
        },
        get_connect_type: function() {
            return connect_type;
        },
        set_connect_type: function(connect_type) {
            connect_type = type;
        }
    };
    
}])
/*
 * 已登录信息服务
 * 在不同视图之间提供已登录用户的信息
 * */
.factory('LoggedInfoService', ['$q', 'ConfigService', 'AgService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, AgService, NotifyService, APP_NOTIFY) {
    var info = {
        username: '',
        password: '',
        instance_id: '',
		ag_url: '',
		local_ip: {}
    };
    
    if (ConfigService.get('service_type') === 'node') {
        return {
            get: function() {
                return info;
            },
            init: function(_info) {
                info = _info;
            },
            set: function(key, value) {
                info[key] = value;
            },
            write: function() {
                var defer1 = $q.defer();
                AgService.get_active_ag().then(function(data) {
                    var ag_url = data.address;
                    if (ag_url === null) {
                        // 没有AG服务器可用
                        // 给出出错消息提示
                        NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                        defer1.reject({
                            code: 404, 
                            msg: 'Active Ag not found.'
                        });
                    } else {
                        info.ag_url = data;
                        require('../node/logged_info').write_logged_info(info, function(error) {
                            if (error !== null) {
                                defer1.reject(error);
                            } else {
                                defer1.resolve();
                            }
                        });
                    }
                });
                return defer1.promise;
            },
            write_show_name: function(show_name) {
                var defer1 = $q.defer();
                require('../node/logged_info').write_instance_name(show_name, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            write_test_result: function(result){
                var defer1 = $q.defer();
                require('../node/logged_info').write_test_result(result,function(error) {
                    if(error){
                        console.log('Write Result Failed !');
                    } else {
                        console.log('Write Result Ok !');
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        return {
            get: function() {
                return info;
            },
            init: function(_info) {
                info = _info;
            },
            set: function(key, value) {
                info[key] = value;
            },
            write: function() {
                var defer1 = $q.defer();
                AgService.get_active_ag().then(function(data) {
                    var ag_url = data.address;
                    if (ag_url === null) {
                        // 没有AG服务器可用
                        // 给出出错消息提示
                        NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                        defer1.reject({
                            code: 404, 
                            msg: 'Active Ag not found.'
                        });
                    } else {
                        info.ag_url = data;
                        var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                        _utils.writeFile("/sdcard/xview/data/logged_info.json", JSON.stringify(info), function(error) {
                            if (error !== null) {
                                defer1.reject(error);
                            } else {
                                defer1.resolve();
                            }
                        });
                    }
                });
                return defer1.promise;
            },
            write_show_name: function(show_name) {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.writeFile("/sdcard/xview/data/name.txt", show_name, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        }
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
    
}])
/*
 * 登录服务
 * 提供用户登录服务
 * */
.factory('LoginService', ['$http', '$q', 'AgService', 'NotifyService', 'APP_NOTIFY', function($http, $q, AgService, NotifyService, APP_NOTIFY) {
    
    return {
        get_token: function(username, password, local_ip) {
            var defer1 = $q.defer();
            username = username.replace('\\', '@@@');
            AgService.get_active_ag().then(function(data) {
                var ag_url = data.address;
                if (ag_url === null) {
                    // 没有AG服务器可用
                    // 给出出错消息提示
                    NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                    defer1.reject({
                        code: 404, 
                        msg: 'Active Ag not found.'
                    });
                } else {
                    $http({
                        method: "GET",
                        url: 'http://' + ag_url + '/api/user/login',
                        params: {
                            "username": username,
                            "passwd": password,
                            "address": local_ip.address,
                            "mac": local_ip.mac
                        },
                        headers: {
                            "Content-Type": "application/json"
                        },
                        timeout: 30000
                    }).then(function(response) {
                        defer1.resolve(response.data);
                    }, function(errResponse) {
                        defer1.reject({
                            code: errResponse.status, 
                            msg: errResponse.statusText,
                            body: errResponse.data
                        });
                    });
                }
            });
            return defer1.promise;
        },
        get_resources: function(token, resource_type) {
            var defer1 = $q.defer();
            AgService.get_active_ag().then(function(data) {
                var ag_url = data.address;
                if (ag_url === null) {
                    // 没有AG服务器可用
                    // 给出出错消息提示
                    NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                    defer1.reject({
                        code: 404, 
                        msg: 'Active Ag not found.'
                    });
                } else {
                    if (resource_type === 'instance') {
                        $http({
                            method: "GET",
                            url: 'http://' + ag_url + '/api/user/get_instance',
                            params: {
                                "token_id": token['token']['id'],
                                "user_id": token['user']['id']
                            },
                            headers: {
                                "Content-Type": "application/json"
                            },
                            timeout: 30000
                        }).then(function(response) {
                            defer1.resolve(response.data);
                            // console.log(JSON.stringify(response.data));
                        }, function(errResponse) {
                            defer1.reject({
                                code: errResponse.status, 
                                msg: errResponse.statusText,
                                body: errResponse.data
                            });
                        });
                    } else {
                        // FIXME 处理其他类型的资源请求
                    }
                }
            });
            return defer1.promise;
        },
        get_connect_address: function(connect_type, token, instance_id) {
            var defer1 = $q.defer();
            AgService.get_active_ag().then(function(data) {
                var ag_url = data.address;
                var ag_proxy = data.proxy;
                if (ag_url === null) {
                    // 没有AG服务器可用
                    // 给出出错消息提示
                    NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                    defer1.reject({
                        code: 404, 
                        msg: 'Active Ag not found.'
                    });
                } else {
                    if (connect_type === 'spice') {
                        $http({
                            method: "GET",
                            url: 'http://' + ag_url + '/api/user/get_spice_address',
                            params: {
                                "instance_uuid": instance_id,
                                "token_id": token['token']['id'],
                                "user_id": token['user']['id'],
                                "terminal_ip": ag_url.split(':')[0],
                                "proxy" : ag_proxy,
                            },
                            headers: {
                                "Content-Type": "application/json"
                            },
                            timeout: 30000
                        }).then(function(response) {
                            defer1.resolve(response.data);
                            console.log(JSON.stringify(response.data));

                        }, function(errResponse) {
                            defer1.reject({
                                code: errResponse.status, 
                                msg: errResponse.statusText,
                                body: errResponse.data
                            });
                        });
                    } else if (connect_type === 'rdp'){
                        // FIXME 处理其他类型的连接请求
                        $http({
                            method:"GET",
                            url: 'http://' + ag_url + '/api/user/get_rdp_address',
                            params:{
                                "instance_uuid": instance_id,
                                "token_id": token['token']['id'],
                                "user_id": token['user']['id'],
                                "terminal_ip": ag_url.split(':')[0],
                                "proxy": ag_proxy,
                            },
                            headers:{
                                "Content-Type": "application/json"
                            },
                            timeout:3000
                        }).then(function(response){
                            defer1.resolve(response.data);
                        },function(errResponse){
                            defer1.reject({
                                code:errResponse.status,
                                msg:errResponse.statusText,
                                body:errResponse.data
                            });
                        })
                    }
                }
            });
            return defer1.promise;
        },
        change_password: function(username, old_pwd, new_pwd, local_ip) {
            var defer1 = $q.defer();
            username = username.replace('\\', '@@@');
            
            AgService.get_active_ag().then(function(data) {
                var ag_url = data.address;
                if (ag_url === null) {
                    // 没有AG服务器可用
                    // 给出出错消息提示
                    NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                    defer1.reject({
                        code: 404, 
                        msg: 'Active Ag not found.'
                    });
                } else {
                    $http({
                        method: "GET",
                        url: 'http://' + ag_url + '/api/user/change_passwd',
                        params: {
                            "username": username,
                            "old_password": old_pwd,
                            "new_password": new_pwd,
                            "address": local_ip.address,
                            "mac": local_ip.mac,
                        },
                        headers: {
                            "Content-Type": "application/json"
                        },
                        timeout: 30000
                    }).then(function(response) {
                        defer1.resolve(response.data);
                    }, function(errResponse) {
                        defer1.reject({
                            code: errResponse.status, 
                            msg: errResponse.statusText,
                            body: errResponse.data
                        });
                    });
                }
            });
            return defer1.promise;
        },
        instance_action: function(token, instance_id, action) {
            var defer1 = $q.defer();
            var token_id = token['token']['id'];
            var project_id = token['tenant_id'];
            var _action = {'boot': 'start', 'shutoff': 'stop', 'reboot': 'reboot'}[action];
            
            if (!_action) {
                defer1.rejct({
                    code: 400,
                    msg: 'Action nonsupport: ' + action,
                    body: '' 
                });
                return defer1.promise;
            }

            AgService.get_active_ag().then(function(data) {
                var ag_url = data.address;
                if (ag_url === null) {
                    // 没有AG服务器可用
                    // 给出出错消息提示
                    NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                    defer1.reject({
                        code: 404, 
                        msg: 'Active Ag not found.'
                    });
                } else {
                    $http({
                        method: "GET",
                        url: 'http://' + ag_url + '/api/instance/action',
                        params: {
                            "token_id": token_id,
                            "instance_uuid": instance_id,
                            "tenant_id": project_id,
                            "action": _action
                        },
                        headers: {
                            "Content-Type": "application/json"
                        },
                        timeout: 30000
                    }).then(function(response) {
                        defer1.resolve(response.data);
                    }, function(errResponse) {
                        defer1.reject({
                            code: errResponse.status, 
                            msg: errResponse.statusText,
                            body: errResponse.data
                        });
                    });
                }
            });
            return defer1.promise;
        }
    };
}])
/* 
 * 终端服务
 * 处理启动连接终端等服务
 * */
.factory('TerminalService', ['$q', '$interval', '$http', 'ConfigService', 'AgService', 'NotifyService', 'APP_NOTIFY', function($q, $interval, $http, ConfigService, AgService, NotifyService, APP_NOTIFY) {
    var terminal_pid = null;
    var report_interval_id = null;
    var re_connect = false;
    
    var _report = function(address, instance_id, ag_url, msg, callback) {
        $http({
            method: "POST",
            url: 'http://' + ag_url + '/api/user/report',
            data: {
                spice_address: address,
                instance_id: instance_id,
                msg: msg
            },
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 30000
        }).then(function(response) {
            callback(null, response.data);
        }, function(errResponse) {
            callback({
                code: errResponse.status, 
                msg: errResponse.statusText,
                body: errResponse.data
            });
        });
    };
    
    var _logout = function(instance_id, ag_url, callback) {
        $http({
            method: "POST",
            url: 'http://' + ag_url + '/api/user/logout',
            data: {
                instance_id: instance_id
            },
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 30000
        }).then(function(response) {
            callback(null, response.data);
        }, function(errResponse) {
            callback({
                code: errResponse.status, 
                msg: errResponse.statusText,
                body: errResponse.data
            });
        });
    };
    
    if (ConfigService.get('service_type') === 'node') {
        var terminal_stop = function(pid, callback) {
            require("../node/system").kill(pid, callback);
        };
        return {
            terminal_start: function(connect_type, address, instance_id, callback) {
                console.log(connect_type + address);
                re_connect = false;
                var defer1 = $q.defer();
                AgService.get_active_ag().then(function(data) {
                    var ag_url = data.address;
                    if (ag_url === null) {
                        // 没有AG服务器可用
                        // 给出出错消息提示
                        NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                            defer1.reject({
                            code: 404, 
                            msg: 'Active Ag not found.'
                        });
                    } else {
                        var terminal = require('../node/terminal');
                        var terminal_pid = terminal.terminal_start(connect_type, address, function(code) {
                            $interval.cancel(report_interval_id);
                            _logout(instance_id, ag_url, function(error) {
                                if (error !== null) {
                                    // 登出失败
                                } else {
                                    // 登出成功
                                }
                            });
                            if (code === 0) {
                                defer1.resolve();
                            } else {
                                defer1.reject({code: code, re_connect: re_connect});
                            }
                        });
                        if (terminal_pid) {
                            var _address = null;
                            if (connect_type === 'spice') {
                                _address = address.spice_address;
                            } else if (connect_type === 'rdp'){
                                _address = address;

                            }
                            
                            //上报心跳并返回信息显示
                            _report(_address, instance_id, ag_url, 'ACTIVE', function(error, data) {
                                var msg = '';
                                if (error !== null) {
                                    // 上报心跳出错
                                } else {
                                    if (data && data.command) {
                                        if (data.command === 'off-line') {
                                            msg = '您已经被管理员强制下线.';
                                            new window.Notification(msg);
                                            terminal_stop(terminal_pid, function(error) {
                                                if (error !== null) {
                                                    // 终止失败
                                                } else {
                                                    // 终止成功
                                                }
                                            });
                                        } else if (data.command === 're-connect') {
                                            re_connect = true;
                                            terminal_stop(terminal_pid, function(error) {
                                                if (error !== null) {
                                                    // 终止失败
                                                } else {
                                                    // 终止成功
                                                }
                                            });
                                        } else if (data.command === 'push-message') {
                                            msg = data.message;
                                            defer1.notify(msg);
                                        }
                                    }
                                }
                            });
                            report_interval_id = $interval(function() {
                                _report(_address, instance_id, ag_url, 'ACTIVE', function(error, data) {
                                    var msg = '';
                                    if (error !== null) {
                                        // 上报心跳出错
                                    } else {
                                        if (data && data.command) {
                                            if (data.command === 'off-line') {
                                                msg = '您已经被管理员强制下线.';
                                                new window.Notification(msg);
                                                terminal_stop(terminal_pid, function(error) {
                                                    if (error !== null) {
                                                        // 终止失败
                                                    } else {
                                                        // 终止成功
                                                    }
                                                });
                                            } else if (data.command === 're-connect') {
                                                re_connect = true;
                                                terminal_stop(terminal_pid, function(error) {
                                                    if (error !== null) {
                                                        // 终止失败
                                                    } else {
                                                        // 终止成功
                                                    }
                                                });
                                            } else if (data.command === 'push-message') {
                                                msg = data.message;
                                                defer1.notify(msg);
                                            }
                                        }
                                    }
                                });
                            }, 30000);
                        }
                    }
                });
                return defer1.promise;
            },
            direct_terminal_start: function(address) {
                var terminal = require('../node/terminal');
                terminal.terminal_start('spice', address, function(code) {});
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端实现
        return {
            terminal_start: function(connect_type, address, instance_id, callback) {
                var ag_url = AgService.get_active_ag().address;
                if (ag_url === null) {
                    // 没有AG服务器可用
                    // 给出出错消息提示
                    NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                    defer1.reject({
                        code: 404, 
                        msg: 'Active Ag not found.'
                    });
                } else {
                    if (connect_type === 'spice') {
                        var _terminal = cordova.require("cordova-plugin-dialog.CustomDialog");
                        _terminal.show(address, function(error) {
                            if (error !== null) {
                                alert(error);
                            }
                        });
                    } 
                }
            },
            direct_terminal_start: function(address) {
                var _terminal = cordova.require("cordova-plugin-dialog.CustomDialog");
                _terminal.show(address, function(error) {
                    if (error !== null) {
                        alert(error);
                    }
                });
            }
        }
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
    
}])
/* 
 * 快速登录服务
 * 提供快速登录功能的初始化及CRUD
 * */
.factory('QuickLoginService', ['$q', 'ConfigService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, NotifyService, APP_NOTIFY) {
    var list = [];
    
    if (ConfigService.get('service_type') === 'node') {
        return {
            init: function() {
                var defer1 = $q.defer();
                require('../node/quick_login').get(function(error, data) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        list = data;
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            get: function() {
                return list;
            },
            add: function(user) {
                var defer1 = $q.defer();
                var _same = list.filter(function(_user) {
                    return _user.name === user.name;
                });
                if (_same.length > 0) {
                    defer1.reject({code: 409, msg: 'key same.'});
                    return defer1.promise;
                }
                list.push(user);
                require('../node/quick_login').set(list, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            update: function(user) {
                var defer1 = $q.defer();
                list.forEach(function(_user) {
                    if (_user['name'] === user['name']) {
                        _user['username'] = user['username'];
                        _user['password'] = user['password'];
                        _user['instance_name'] = user['instance_name']
                        _user['ag_server'] = user['ag_server'];
                        _user['auto'] = user['auto'];
                    }
                });
                require('../node/quick_login').set(list, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            del: function(name) {
                var defer1 = $q.defer();
                list = list.filter(function(_user) {
                    return _user['name'] != name;
                });
                require('../node/quick_login').set(list, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            destroy: function() {
                var defer1 = $q.defer();
                require('../node/quick_login').set([], function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        list = [];
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端实现
        return {
            init: function() {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.readFile("/sdcard/xview/data/quick_login.json", function(error, data) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        if (data) {
                            list = JSON.parse(data);
                        } else {
                            list = [];
                        }
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            get: function() {
                return list;
            },
            add: function(user) {
                var defer1 = $q.defer();
                list.push(user);
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.writeFile("/sdcard/xview/data/quick_login.json", JSON.stringify(list), function() {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            update: function(user) {
                var defer1 = $q.defer();
                list.forEach(function(_user) {
                    if (_user['name'] === user['name']) {
                        _user['username'] = user['username'];
                        _user['password'] = user['password'];
                        _user['instance_name'] = user['instance_name']
                        _user['ag_server'] = user['ag_server'];
                        _user['auto'] = user['auto'];
                    }
                });
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.writeFile("/sdcard/xview/data/quick_login.json", JSON.stringify(list), function() {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            del: function(name) {
                var defer1 = $q.defer();
                list = list.filter(function(_user) {
                    return _user['name'] != name;
                });
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.writeFile("/sdcard/xview/data/quick_login.json", JSON.stringify(list), function() {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            destroy: function() {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.writeFile("/sdcard/xview/data/quick_login.json", JSON.stringify([]), function() {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        list = [];
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        }
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
    
}])
/* 
 * 安全设置密码服务
 * 主要完成安全设置密码的验证和修改功能
 * */
.factory('SecurityPasswordService', ['$q', 'ConfigService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, NotifyService, APP_NOTIFY) {
    var password = '';
    var done = false;
    
    if (ConfigService.get('service_type') === 'node') {
        return {
            check: function(_password) {
                var defer1 = $q.defer();
                if (done === true) {
                    defer1.resolve(password === _password);
                } else {
                    require('../node/security_password').get(function(error, data) {
                        if (error !== null) {
                            defer1.reject(error);
                        } else {
                            password = data;
                            done = true;
                            defer1.resolve(password === _password);
                        }
                    });
                }
                return defer1.promise;
            },
            change: function(new_password) {
                var defer1 = $q.defer();
                require('../node/security_password').set(password, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        password = new_password;
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端实现
        return {
            check: function(_password) {
                var defer1 = $q.defer();
                if (done === true) {
                    defer1.resolve(password === _password);
                } else {
                    var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                    _utils.readFile("/sdcard/xview/data/security_password.json", function(error, data) {
                        if (error !== null) {
                            defer1.reject(error);
                        } else {
                            if (data !== null) {
                                password = JSON.parse(data);
                                done = true;
                                defer1.resolve(password === _password);
                            } else {
                                _utils.readConf("www/etc/default_security_password.json", function(error, data) {
                                    if (error !== null) {
                                        defer1.reject(error);
                                    } else {
                                        password = JSON.parse(data);
                                        done = true;
                                        defer1.resolve(password === _password);
                                    }
                                });
                            }
                        }
                    });
                }
                return defer1.promise;
            },
            change: function(new_password) {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.writeFile("/sdcard/xview/data/security_password.json", JSON.stringify(new_password), function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        password = new_password;
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
    
}])
/* 
 * 系统服务
 * 提供和系统相关的服务，如关机、重启等
 * */
.factory('SystemService', ['$q', 'ConfigService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, NotifyService, APP_NOTIFY) {
    
    if (ConfigService.get('service_type') === 'node') {
        return {
            shutoff: function() {
                var defer1 = $q.defer();
                require('../node/system').shutoff(function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            reboot: function() {
                var defer1 = $q.defer();
                require('../node/system').reboot(function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            get_datetime: function(format) {
                var defer1 = $q.defer();
                require('../node/datetime').get_datetime(format, function(error, result) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(result);
                    }
                });
                return defer1.promise;
            },
            set_datetime: function(datetime, format) {
                var defer1 = $q.defer();
                require('../node/datetime').set_datetime(datetime, format, function(error, result) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(result);
                    }
                });
                return defer1.promise;
            },
            set_ntp_server: function(address) {
                var defer1 = $q.defer();
                require('../node/datetime').set_ntp_server(address, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
			exit: function() {
				require('../node/system').exit();
			},
            open_backdoor: function() {
                var defer1 = $q.defer();
                require('../node/system').open_backdoor(function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端实现
        return {
            shutoff: function(callback) {
                callback(null);
            },
            reboot: function(callback) {
                callback(null);
            },
            get_datetime: function() {
                var defer1 = $q.defer();
                defer1.resolve("2017-01-01T00:00:00");
                return defer1.promise;
            },
            set_datetime: function() {},
            set_ntp_server: function() {},
            exit: function() {},
            open_backdoor: function() {
                var defer1 = $q.defer();
                var _settings_utils = cordova.require("cordova-plugin-dialog.SettingsUtil");
                _settings_utils.open_backdoor(function(error, data) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(null);
                    }
                });
                return defer1.promise;
            }
        };
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
    
}])
/* 
 * 显示服务
 * 提供和显示相关的服务，如分辨率设置获取、亮度设置获取、显示模式设置等
 * */
.factory('DisplayService', ['$q', 'ConfigService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, NotifyService, APP_NOTIFY) {
    if (ConfigService.get('service_type') === 'node') {
        return {
            get_resolution: function() {
				var defer1 = $q.defer();
                require('../node/display').get_resolution(function(error, list) {
					if (error !== null) {
						defer1.reject(error);
					} else {
						defer1.resolve(list);
					}
				});
				return defer1.promise;
            },
            set_resolution: function(display) {
				var defer1 = $q.defer();
                require('../node/display').set_resolution(display, function(error) {
					if (error !== null) {
						defer1.reject(error);
					} else {
						defer1.resolve();
					}
				});
				return defer1.promise;
            },
            get_display_mode: function() {
				var defer1 = $q.defer();
                require('../node/display').get_display_mode(function(error, result) {
					if (error !== null) {
						defer1.reject(error);
					} else {
						defer1.resolve(result);
					}
				});
				return defer1.promise;
            },
            set_display_mode: function(mode, displays) {
				var defer1 = $q.defer();
                require('../node/display').set_display_mode(mode, displays, function(error) {
					if (error !== null) {
						defer1.reject(error);
					} else {
						defer1.resolve();
					}
				});
				return defer1.promise;
            },
            get_lighteness: function() {
                var defer1 = $q.defer();
                require('../node/display').get_lighteness(function(error, result) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(result);
                    }
                });
                return defer1.promise;
            },
            set_lighteness: function(lighteness) {
                var defer1 = $q.defer();
                require('../node/display').set_lighteness(lighteness, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端实现
        return {};
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
    
}])
/* 
 * 声音服务
 * 提供声音的设置
 * */
.factory('VoiceService', ['$q', 'ConfigService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, NotifyService, APP_NOTIFY) {
    if (ConfigService.get('service_type') === 'node') {
        return {
            get_voice: function() {
                var defer1 = $q.defer();
                require('../node/voice').get_voice(function(error, voice) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(voice);
                    }
                });
                return defer1.promise;
            },
            set_voice: function(voice) {
                var defer1 = $q.defer();
                require('../node/voice').set_voice(voice, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
			get_mute: function() {
				var defer1 = $q.defer();
                require('../node/voice').get_mute(function(error, mute) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(mute);
                    }
                });
                return defer1.promise;
			},
			set_mute: function(mute) {
				var defer1 = $q.defer();
                require('../node/voice').set_mute(voice, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
			}
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端实现
        return {};
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
}])
/* 
 * USB服务
 * 提供USB设备的访问控制权限的设置
 * */
.factory('USBService', ['$http', '$q', 'ConfigService', 'AgService', 'NotifyService', 'APP_NOTIFY', function($http, $q, ConfigService, AgService, NotifyService, APP_NOTIFY) {
	var get_service_config = function(token) {
		var defer1 = $q.defer();
		AgService.get_active_ag().then(function(data) {
			var ag_url = data.address;
			if (ag_url === null) {
				// 没有AG服务器可用
			    // 给出出错消息提示
		        NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
				defer1.reject({
                    code: 404, 
                    msg: 'Active Ag not found.'
                });
			} else {
				$http({
					method: "GET",
					url: 'http://' + ag_url + '/api/usb/config',
					params: {
						"token_id": token['token']['id'],
						"user_id": token['user']['id']
					},
					headers: {
						"Content-Type": "application/json"
					},
					timeout: 30000
				}).then(function(response) {
					defer1.resolve(JSON.parse(JSON.parse(response.data)));
				}, function(errResponse) {
					defer1.reject({
						code: errResponse.status, 
						msg: errResponse.statusText,
						body: errResponse.data
					});
				});
			}
		});
		
		return defer1.promise;
	};
	
    if (ConfigService.get('service_type') === 'node') {
        return {
			get_service_config: get_service_config,
            get_devices: function(callback) {
                require('../node/usb').get_devices(callback);
            },
            set_local_access: function(devices) {
                var defer1 = $q.defer();
                require('../node/usb').set_local_access(devices, function(error) {
                    if (error !== null) {
                        defer1.reject();
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            get_local_access: function() {
				var defer1 = $q.defer();
                require('../node/usb').get_local_access(function(error, access) {
					if (error !== null) {
						defer1.reject(error);
					} else {
						defer1.resolve(access);
					}
				});
				return defer1.promise;
            },
			set_boot_access: function(server_config, local_access) {
			    var defer1 = $q.defer();
				require('../node/usb').set_boot_access(server_config, local_access, function(error) {
				    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
				});
				return defer1.promise;
			}
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端实现
        return {
            get_service_config: get_service_config,
            get_devices: function(callback) {
                require('../node/usb').get_devices(callback);
            },
            set_local_access: function(devices) {
                var defer1 = $q.defer();
                defer1.resolve();
                return defer1.promise;
            },
            get_local_access: function() {
                var defer1 = $q.defer();
                defer1.resolve({});
                return defer1.promise;
            },
            set_boot_access: function(server_config, local_access) {
                var defer1 = $q.defer();
                
                // 将管理端和本地端的USB设备权限解析成字符串
                var content = [];
                for (var _k in local_access) {
                    var _arr = _k.split(':');
                    content.push(['vid:'+_arr[0], 'pid:'+_arr[1], 'enable_redir:'+(local_access[_k].enabled?'1':'0'), 'rw:'+(local_access[_k].rw?'1':'0')].join(","));
                }
                if (server_config.all) {
                    content.push(['global_disable_redir:'+(server_config.all.enabled === "true"?'0':'1')]);
                } else {
                    content.push(['global_disable_redir:0']);
                }
                for (var _i in server_config.devices) {
                    content.push([
                        'classId:'+server_config.devices[_i].type.base_class, 
                        'subClassId:'+server_config.devices[_i].type.sub_class,
                        'protocol:'+server_config.devices[_i].type.protocol,
                        'enable_redir:'+(server_config.devices[_i].enabled === 'true'?'1':'0'), 
                        'rw:'+(server_config.devices[_i].rw === 'true'?'1':'0')
                    ].join(","));
                }
                var line_break = '\n';
                
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.writeFile("/sdcard/xview/data/usb_boot_access.info", content.join(line_break), function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
}])
/* 
 * 设备信息服务
 * 提供设备信息
 * */
.factory('DeviceInfoService', ['$q', 'ConfigService', 'NotifyService', 'APP_NOTIFY', function($q, ConfigService, NotifyService, APP_NOTIFY) {
    var device_info = null;
    var done = false;
    
    if (ConfigService.get('service_type') === 'node') {
        return {
            get: function() {
                var defer1 = $q.defer();
                if (done) {
                    defer1.resolve(device_info);
                } else {
                    require('../node/dev_info').get(function(error, dev_info) {
                        if (error !== null) {
                            // 获取设备信息失败
                            defer1.reject(error);
                        } else {
                            device_info = dev_info;
                            done = true;
                            defer1.resolve(dev_info);
                        }
                    });
                }
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端实现
        return {
            get: function() {
                var defer1 = $q.defer();
                if (done) {
                    defer1.resolve(device_info);
                } else {
                    var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                    _utils.readConf("www/etc/device_info.json", function(error, data) {
                        if (error !== null) {
                            // 获取设备信息失败
                            defer1.reject(error);
                        } else {
                            var dev_info = JSON.parse(data);
                            device_info = dev_info;
                            done = true;
                            defer1.resolve(dev_info);
                        }
                    });
                }
                return defer1.promise;
            }
        };
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
    
}])
/* 
 * 备份信息服务
 * 提供实例备份信息及发送是否备份请求
 * */
.factory('SnapshotService', ['$http', '$q', 'ConfigService', 'AgService', 'NotifyService', 'APP_NOTIFY', function($http, $q, ConfigService, AgService, NotifyService, APP_NOTIFY) {	
	return {
		revert: function(token, instance_id, logged_type) {			
			var defer1 = $q.defer();
			// FIXME 发送到服务端进行回滚操作
			defer1.resolve();
			
			
			return defer1.promise;	
		}

	}
}])
/* 
 * 系统更新服务
 * 提供系统更新及本地升级
 * */
.factory('UpdateService', ['$interval', '$q', '$http', 'ConfigService', 'AgService', 'UtilsService', 'NotifyService', 'APP_NOTIFY', function($interval, $q, $http, ConfigService, AgService, UtilsService, NotifyService, APP_NOTIFY) {
    var local_version = {
        client: {value: '', done: false},
        lander: {value: '', done: false},
        ROM: {value: '', done: false},
        alone: {value: false, done: false}
    };
    var server_version = {};
    var update_type = '';
    var update_urls = [];
    var update_md5sum = [];
    var update_server_address = '';
    var done = false;
    var _get_server_version = function() {
        var defer1 = $q.defer();

        var _platform = ConfigService.get('platform');
        AgService.get_active_ag().then(function(data) {
            var ag_url = data.address;
            if (ag_url === null) {
                // 没有AG服务器可用
                // 给出出错消息提示
                NotifyService.show(APP_NOTIFY.ag.activeGet.notFound);
                defer1.reject({
                    code: 404, 
                    msg: 'Active Ag not found.'
                });
            } else {
                $http({
                    method: "GET",
                    url: 'http://'+ ag_url +'/api/upgrade/' + _platform,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 30000
                }).then(function(response) {
                    defer1.resolve(response.data);
                }, function(errResponse) {
                    defer1.reject({
                        code: errResponse.status, 
                        msg: errResponse.statusText,
                        body: errResponse.data
                    });
                });
            }
        });
            
        return defer1.promise;
    };
    var _check_update = function() {
        var defer1 = $q.defer();
        _get_server_version().then(function(result) {
            server_version = result;
            update_type = '';
            update_urls = [];
            update_md5sum = [];
            if (result && result['xview-client']) {
                if (UtilsService.compare_version('client', local_version.client.value, result['xview-client'].version) === true) {
                    // 协议有更新可用
                    update_urls.push(result['xview-client'].url);
                    update_md5sum.push(result['xview-client'].md5sum);
                    update_type = 'c';
                }
            }
            if (result && result['xview-lander']) {
                if (UtilsService.compare_version('lander', local_version.lander.value, result['xview-lander'].version) === true) {
                    // 客户端有更新可用
                    update_urls.push(result['xview-lander'].url);
                    update_md5sum.push(result['xview-lander'].md5sum);
                    update_type = 'l';
                }
            }
            if (result && result['ROM']) {
                if (UtilsService.compare_version('ROM', local_version.ROM.value, result['ROM'].version) === true) {
                    // 客户端有更新可用
                    update_urls.push(result['ROM'].url);
                    update_md5sum.push(result['ROM'].md5sum);
                    update_type = 'R';
                }
            }
            if (update_urls.length > 1) {
                if (update_type === 'R') {
                    update_type = 'laR';
                } else {
                    update_type = 'cal';
                }
            }
            if (update_urls.length > 0 && update_md5sum.length > 0) {
                defer1.resolve(true);
            } else {
                defer1.resolve(false);
            }
        }, function(error) {
            defer1.reject(error);
        });
        return defer1.promise;
    };
    
    if (ConfigService.get('service_type') === 'node') {
        return {
            get_local_version: function() {
                var defer1 = $q.defer();
                if (local_version.client.done && local_version.lander.done) {
                    defer1.resolve({
                        lander: local_version.lander.value, 
                        client: local_version.client.value, 
                        alone_protocol: local_version.alone.value
                    });
                } else {
                    require("../node/update").get_version(function(error, data) {
                        if (error !== null) {
                            defer1.reject(error);
                        } else {
                            local_version.client.value = data.client;
                            local_version.client.done = true;
                            local_version.lander.value = data.lander;
                            local_version.lander.done = true;
                            local_version.alone.value = data.alone_protocol;
                            local_version.alone.done = true;
                            defer1.resolve(data);
                        }
                    });
                }
                return defer1.promise;
            },
            check_update: _check_update,
            update: function() {
                var defer1 = $q.defer();
                require("../node/update").update(update_type, update_urls, update_md5sum, function(error, data) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(data);
                    }
                });
                return defer1.promise;
            },
            local_update: function() {
                var defer1 = $q.defer();
                require("../node/update").local_update(function(error, result) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        if (result === true) {
                            defer1.resolve();
                        } else {
                            defer1.reject({code: 404, msg: 'not found'});
                        }
                    }
                });
                return defer1.promise;
            },
            set_server_address: function(address) {
                var defer1 = $q.defer();
                require("../node/update").set_server_address(address, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        update_server_address = address;
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            get_server_address: function() {
                var defer1 = $q.defer();
                if (done) {
                    defer1.resolve(update_server_address);
                } else {
                    require("../node/update").get_server_address(function(error, result) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        update_server_address = result;
                        done = true;
                        defer1.resolve(result);
                    }
                });
                }
                
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        // cordova后端实现
        return {
            get_local_version: function() {
                var defer1 = $q.defer();
                if (local_version.lander.done && local_version.ROM.done) {
                    defer1.resolve({
                        lander: local_version.lander.value,
                        ROM: local_version.ROM.value
                    });
                } else {
                    var _update_utils = cordova.require("cordova-plugin-dialog.Update");
                    _update_utils.get_version(function(error, data) {
                        var _version = JSON.parse(data);
                        local_version.lander.value = _version.vername;
                        local_version.lander.done = true;
                        local_version.ROM.value = _version.romver;
                        local_version.ROM.done = true;
                        defer1.resolve({lander: _version.vername, ROM: _version.romver});
                    });
                }
                return defer1.promise;
            },
            check_update: _check_update,
            update: function() {
                var defer1 = $q.defer();
                var _update_utils = cordova.require("cordova-plugin-dialog.Update");
                _update_utils.update(update_type, update_urls, update_md5sum, function(error, data) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(data);
                    }
                });
                return defer1.promise;
            },
            local_update: function() {
                var defer1 = $q.defer();
                defer1.resolve();
                return defer1.promise;
            },
            set_server_address: function(address) {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.writeFile("/sdcard/xview/data/update_server_address.json", JSON.stringify(address), function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        update_server_address = address;
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            },
            get_server_address: function() {
                var defer1 = $q.defer();
                if (done) {
                    defer1.resolve(update_server_address);
                } else {
                    var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                    _utils.readFile("/sdcard/xview/data/update_server_address.json", function(error, data) {
                        if (error !== null) {
                            defer1.reject(error);
                        } else {
                            if (data !== null) {
                                var _address = JSON.parse(data);
                                update_server_address = _address;
                                defer1.resolve(update_server_address);
                            } else {
                                defer1.resolve('');
                            }
                            done = true;
                        }
                    });
                }
                return defer1.promise;
            }
        };
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
}])
/* 
 * 工具服务
 * 提供各种系统工具的服务
 * */
.factory('UtilsService', [function() {
    return {
        compare_version: function(module, local_version, server_version) {
            var _local_arr = local_version.split('.');
            var _server_arr = server_version.split('.');
            if (module === 'client' || module === 'lander') {
            	if (Number(_local_arr[3]) < Number(_server_arr[3])) {
                    return true;
                } else if (Number(_local_arr[3]) == Number(_server_arr[3])) {
                    if (Number(_local_arr[4]) < Number(_server_arr[4])) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else if (module === 'ROM') {
            	if (Number(_local_arr[0]) < Number(_server_arr[0])) {
            		return true;
            	} else if (Number(_local_arr[0]) == Number(_server_arr[0])) {
            		if (Number(_local_arr[1]) < Number(_server_arr[1])) {
            			return  true;
            		} else if (Number(_local_arr[1]) == Number(_server_arr[1])) {
            			if (Number(_local_arr[2]) < Number(_server_arr[2])) {
            				return true;
            			} else {
            				return false;
            			}
            		} else {
            			return false;
            		}
            	} else {
            		return false;
            	}
            }
        }
    };
}])
/* 
 * 国际化服务
 * 提供国际化服务获取和设置语言功能
 * */
.factory('I18nService', ['$q', 'ConfigService', function($q, ConfigService) {
    var current_lang = '';
    var done =false;
    if (ConfigService.get('service_type') === 'node') {
        // 获取已设置的语言
        require('../node/i18n').get_lang(function(error, data) {
            if (error !== null) {
                // 获取已设置语言出错
                var options = {
                    newest_on_top: true,
                    title: "<strong>"+'错误-E021001'+"</strong>",
                    message: "获取语言失败.",
                    icon: 'glyphicon glyphicon-remove-sign',
                };
                $.notify(options, {type: notify.type, z_index: 20002});
            } else {
                if (data) {
                    current_lang = data;
                } else {
                    current_lang = ConfigService.get('default_langue');
                } 
                done = true;
            }
        });
        
        return {
            get_lang_async: function() {
                if (done) {
                    return current_lang;
                } else {
                    return ConfigService.get('default_langue');
                }
            },
            get_lang: function() {
                var defer1 = $q.defer();
                if (done) {
                    defer1.resolve(current_lang);
                } else {
                    require('../node/i18n').get_lang(function(error, data) {
                        if (error !== null) {
                            // 获取已设置语言出错
                            defer1.reject(error);
                        } else {
                            if (data) {
                                current_lang = data;
                                defer1.resolve(current_lang);
                            } else {
                                current_lang = ConfigService.get('default_langue');
                                defer1.resolve(current_lang);
                            } 
                            done = true;
                        }
                    });
                }
                return defer1.promise;
            },
            set_lang: function(lang) {
                var defer1 = $q.defer();
                require("../node/i18n").set_lang(lang, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        current_lang = lang;
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        return {
            get_lang_async: function() {
                if (done) {
                    return current_lang;
                } else {
                    return ConfigService.get('default_langue');
                }
            },
            get_lang: function() {
                var defer1 = $q.defer();
                if (done) {
                    defer1.resolve(current_lang);
                } else {
                    var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                    _utils.readFile("/sdcard/xview/data/lang.json", function(error, data) {
                        if (error !== null) {
                            defer1.reject(error);
                        } else {
                            if (data !== null) {
                                var _lang = JSON.parse(data);
                                current_lang = _lang;
                                defer1.resolve(current_lang);
                            } else {
                                current_lang = ConfigService.get('default_langue');
                                defer1.resolve(current_lang);
                            }
                            done = true;
                        }
                    });
                }
                return defer1.promise;
            },
            set_lang: function(lang) {
                var defer1 = $q.defer();
                var _utils = cordova.require("cordova-plugin-dialog.LocalInfoProvider");
                _utils.writeFile("/sdcard/xview/data/lang.json", JSON.stringify(lang), function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        current_lang = lang;
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else {
        // 不能识别的后端服务类型
        var options = {
            newest_on_top: true,
            title: "<strong>"+'错误-E100101'+"</strong>",
            message: "没有可用的后端服务.",
            icon: 'glyphicon glyphicon-remove-sign',
        };
        $.notify(options, {type: notify.type, z_index: 20002});
    }
    
}])
/* 
 * 消息提示服务
 * 提供消息提示功能
 * */
.factory('NotifyService', ['i18nFilter', function(i18nFilter) {
    return {
        show: function(notify) {
            var options = {
                newest_on_top: true,
            };
            if (notify.code) {
                options['title'] = "<strong>"+i18nFilter(notify.title)+'-'+notify.code+"</strong>";
            } else {
                options['title'] = "<strong>"+i18nFilter(notify.title)+"</strong>";
            }
            options['message'] = i18nFilter(notify.msg, 'notify');
            switch (notify.type) {
                case 'danger': options['icon'] = 'glyphicon glyphicon-remove-sign';break;
                case 'warning': options['icon'] = 'glyphicon glyphicon-question-sign';break;
                case 'success': options['icon'] = 'glyphicon glyphicon-ok-sign';break;
                case 'info': options['icon'] = 'glyphicon glyphicon-info-sign';break;
                default: break;
            }
            
            $.notify(options, {type: notify.type, z_index: 20002});
        }
    };
}])
/* 
 * Ping服务
 * 检测接入网关是否可用
 * */
.factory('PingService', ['$q', '$http', 'AgService', function($q, $http, AgService) {
    return {
        ping: function(ag_url) {
            var defer1 = $q.defer();

            $http({
                method: "GET",
                url: 'http://' + ag_url + '/api/network/ping',
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 2000
            }).then(function(response) {
                defer1.resolve();
            }, function(errResponse) {
                defer1.reject({
                    code: errResponse.status, 
                    msg: errResponse.statusText,
                    body: errResponse.data
                });
            });
            
            return defer1.promise;
        }
    };
}])
/* 
 * 音頻服务
 * 配置音頻輸出設置
 * */
.factory('AudioService', ['$q', '$http', 'ConfigService', 'NotifyService', 'APP_NOTIFY', function($q, $http, ConfigService, NotifyService, APP_NOTIFY) {
    if (ConfigService.get('service_type') === 'node') {
        return {
            get_cards: function() {
                var defer1 = $q.defer();
                require('../node/audio').get_cards(function(error, list) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve(list);
                    }
                });
                return defer1.promise;
            },
            set_card: function(card_index, profile_value) {
                var defer1 = $q.defer();
                require('../node/audio').set_card(card_index, profile_value, function(error) {
                    if (error !== null) {
                        defer1.reject(error);
                    } else {
                        defer1.resolve();
                    }
                });
                return defer1.promise;
            }
        };
    } else if (ConfigService.get('service_type') === 'cordova') {
        return {
            get_cards: function() {
                var defer1 = $q.defer();
                defer.resolve([]);
                return defer1.promise;
            },
            set_card: function() {
                var defer1 = $q.defer();
                defer.resolve();
                return defer1.promise;
            }
        };
    } else {
        // 不能识别的后端服务类型
        // 给出出错消息提示
        NotifyService.show(APP_NOTIFY.service.typeGet.notFound);
    }
}])
/* 
 * 开发者选项服务
 * 提供音开发者选项: 直连、调试等
 * */
.factory('DeveloperOptionsService', ['$q', function($q) {
    var required_debug = false;

    return {
        get_debug_required: function() {
            return required_debug;
        },
        set_debug_required: function(flag) {
            required_debug = flag;
        },
        direct_mode: function() {

        }
    };
}])

/**
  *TestService
  */
.factory('TestService',['$q', 'NetworkService', 'VoiceService', 'DisplayService',function($q, NetworkService, VoiceService, DisplayService){
    return {
        start_test:function(){
            var result = {};
            var defer1 = $q.defer();
            async.waterfall([function(callback) {
                NetworkService.network_status().then(function(data){
                    console.log('Get network OK !');
                    result['status'] = data;
                    callback(null);
                },function(error){
                    console.log('Get network Error !');
                    callback(null);
                });
            },function(callback){
                VoiceService.get_voice().then(function(data){
                    console.log('Get Voice Ok !');
                    result['voice'] = data;
                    callback(null);
                },function(error){
                    console.log('Get Voice failed !');
                    callback(null);
                });
            },function(callback){
                DisplayService.get_resolution().then(function(data){
                    console.log('Get Resolution OK !');
                    result['resolution'] = data;
                    callback(null);
                }, function(error){
                    console.log('Get Resolution Error !');
                    callback(null);
                });
            }], function(error) {
                if(error != null){
                    console.log('error occured !');
                    defer1.reject(error);
                } else {
                    console.log(JSON.stringify(result));
                    defer1.resolve(result);
                }
            });
            return defer1.promise;
        }
    };
}])