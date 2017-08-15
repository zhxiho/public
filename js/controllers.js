/*                                                                                                                                                                         /*
 * 定义各个视图的控制器 
 * */
angular.module('xDeskApp')
/*
 * 主控制器
 * 主要控制其他各个视图的显示及提供配置信息的获取
 * */
.controller('MainCtrl', ['$scope','$interval', '$q', '$timeout', '$location', function($scope, $interval, $q, $timeout, $location) {
    var self = this;

    this.showOperat = false;
    this.operation_mode = '';
    this.network_status = {
        init: true,
        success: false,
        failure: false,
        warn: false
    };
    this.network_ip = '10.10.10.160'
    this.version = 'v 1.2.0';
    this.settings = {
        list: [
            {
                "title": "user_settings",
                "url": "/user_set", 
                "status": true, 
                "isActive": true, 
                "default_index": 0, 
                "list": [
                    {"title": "quick_login", "status": true, "isActive": true},
                    {"title": "change_password", "status": true, "isActive": false}
                ]
            },
            {
                "title": "voice_settings", 
                "url": "/voice_set", 
                "status": true, 
                "isActive": false,
                "default_index": 0,
                "list": [
                    {"title": "voice_settings", "status": true, "isActive": true},
                    {"title": "audio_selection", "status": true, "isActive": false}
                ]
            },
            {
                "title": "usb_settings", 
                "url": "/usb_set", 
                "status": true, 
                "isActive": false,
                "default_index": 0,
            },
            {
                "title": "display_settings", 
                "url": "/display_set", 
                "status": true, 
                "isActive": false,
                "default_index": 0,
            },
            {
                "title": "network_settings", 
                "url": "/network_set", 
                "status": true, 
                "isActive": false,
                "default_index": 0,
            },
            {
                "title": "system_settings", 
                "url": "/system_set", 
                "status": true, 
                "isActive": false,
                "default_index": 0,
                "local_update": false,
                "list": [
                     {"title": "device_info", "status": true, "isActive": true},
                     {"title": "change_security_password", "status": true, "isActive": false},
                     {"title": "langue_settings", "status": true, "isActive": false},
                     {"title": "developer_options", "status": true, "isActive": false}
                ]
            }
        ],
    };
    // tab 页
    this.current = {
        list: this.settings.list[0].list,
    };
    
    // 切换设置项
    this.change_left_tabs_active = function(index) {
        for (var i = 0; i < this.settings.list.length; i++) {
            if(i !== index){
                this.settings.list[i].isActive = false;
            } else {
                this.settings.list[i].isActive = true;
                this.current = {
                    list: this.settings.list[i].list,
                };
            }
        }
        $location.path(this.settings.list[index].url);
    };
    // 切换设置tab
    this.change_top_tabs_active = function(index) {
        for (var i = 0; i < this.current.list.length; i++) {
            if(i !== index){
                this.current.list[i].isActive = false;
            } else {
                this.current.list[i].isActive = true;
            }
        }
    };
    // 切换内网
    this.checkoutIntranet = function(){
        this.network_ip = '10.10.10.160';
    };
    // 切换外网
    this.checkoutExtranet = function(){
        this.network_ip = '192.168.201.17';
    };

    // 主机 开机  关机 重启
    this.operatInstance = function(mode) {
        this.operation_mode = mode;
        this.showOperat = true;
    };

    this.cancelAction = function() {
        this.operation_mode = '';
        this.showOperat = false;
    };

    this.confirmAction = function() {
        this.showOperat = false;
        if(this.operation_mode == 'shutoff'){
            this.shutoff();
        } else if(this.operation_mode == 'reboot'){
            this.reboot();
        }
        this.operation_mode = '';
    };

    this.shutoff = function() {

    };

    this.reboot = function() {

    };
    
}])
/* 
 * 登录视图的控制器
 * 主要完成登录功能
 * */
.controller('LoginCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {
    var self = this;
    this.username = '';
    this.password = '';
    this.local_ip = null;
    this.btn_disabled = false;
    this.showSet = false;
    this.security_password = '';

    this.remember_pw = true;
    this.auto_login = false;

    this.setLogin = function() {
        this.showSet = true;
    };

    this.cancelSet = function() {
        this.showSet = false;
    };

    this.confirmSet = function() {
        this.showSet = false;
        this.security_password = '';
        $location.path('/user_set');

    };

    // 登录
    this.login = function() {
        $location.path('/resources_list');
		
    };

    
    
}])
/* 
 * 资源视图控制器
 * 主要完成选择指定虚机登录虚机
 * */
.controller('ResourcesListCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {

    var self = this;

    this.desktop_pool = {
        name: 'pool_name'
    };
    this.resources = {
        instances: [
            // {
            //     name: 'desk_name_01',
            //     status: 'ACTIVE',
            // },
            // {
            //     name: 'desk_name_02',
            //     status: 'SHOUTOFF',
            // },{
            //     name: 'desk_name_01',
            //     status: 'ACTIVE',
            // },{
            //     name: 'desk_name_02',
            //     status: 'SHOUTOFF',
            // },{
            //     name: 'desk_name_01',
            //     status: 'ACTIVE',
            // },{
            //     name: 'desk_name_02',
            //     status: 'SHOUTOFF',
            // },{
            //     name: 'desk_name_03',
            //     status: 'CREATING',
            // }
        ]
    };
    this.progress_rate = {
        style: {"width": "0%"},
        show_value: '0%',
        value: 0
    };
    this.logged_index = 0;
    this.progress_interval_times = 0;
	this.progress_timeout_id = null;
    this.progress_interval_id = null;
	this.showProgressCancel = false;
    
    this.showAddDesktop = false;
    this.instanceName = '';


	this.showLoading = false;
	this.showTimeout = false;
    this.showSelectType = false;
    this.showOperat = false;
    this.operation_index = '';
    this.operation_mode = '';
    this.multip_protcl = {};

    
    this.goLogin = function() {
        $location.path('/login');
    };
    
    // 添加桌面
    this.addDesktop = function() {
        this.showAddDesktop = true;
    };
    this.cancelAdd = function() {
        this.showAddDesktop = false;
        this.instanceName = '';
    };
    this.confirmAdd = function() {
        this.showAddDesktop = false;
        var obj = {
            name: this.instanceName,
            status: 'CREATING'
        };
        this.resources.instances.push(obj);
        this.instanceName = '';
    };

    // 超时操作
	this.confirmRetry = function() {
        this.showTimeout = false;
	    
	};

    this.cancelGiveUp = function() {
	    this.showTimeout = false;

	};
	

    // 进度条
	this.cancelProgress = function() {
		
	};

    // 执行操作
    this.operatInstance = function(index, action) {
        this.showOperat = true;
        this.operation_index = index;
        this.operation_mode = action;
    };

    this.cancelAction = function() {
        this.showOperat = false;
        this.operation_index = '';
        this.operation_mode = '';
    };

    this.confirmAction = function() {
        this.showOperat = false;
        if(this.operation_mode == 'boot'){
            this.boot();
        } else if(this.operation_mode == 'shutoff'){
            this.shutoff();
        } else if(this.operation_mode == 'reboot'){
            this.reboot();
        }
        this.operation_mode = '';
    };

    this.boot = function() {

    };

    this.shutoff = function() {

    };

    this.reboot = function() {

    };

    // 显示进入方式（SDAP or RDP）弹框
    this.get_into = function(index, type) {
        this.showSelectType = true;
    };

    this.cancelInto = function() {
        this.showSelectType = false;
    };

    this.sdapEnter = function(index, type) {
        
    };

    this.rdpEnter = function(index, type) {
        
    };
    
}])
/* 
 * 声音设置控制器
 * */
.controller('VoiceCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {
    var self = this;
    self.mute = false;
    self.range = 0;
    
    self.apply = function() {

    };
}])
/* 
 * 音频选择控制器
 * */
.controller('AudioCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {
    var self = this;
    self.selectAudio = null;
    self.audioOptions = [];
    
    self.apply = function() {
        
    };
}])
/* 
 * USB 控制器
 * */
.controller('USBCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {
    var self = this;

    self.enableList = [];
    self.disableList = [];

    // 全选
    self.selectAll = function(list) {

    };

    // 全不选
    self.unselectAll = function(list) {
        
    };     

    // 反选
    self.reversed = function(list) {
        
    };

    // 移入禁用
    self.moveDisable = function() {
        
    };
    
    // 移入可用
    self.moveEnable = function() {
        
    };
    
    self.apply = function() {
        
    };
}])
/* 
 * 音频选择控制器
 * */
.controller('DisplayCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {
    var self = this;
    self.selectResole = null;
    self.resoleOptions = [];
    self.selectDisplay = null;
    self.displayModeOptions = [];
    self.lighte = 0;
    
    self.apply = function() {
        
    };
}])
/* 
 * 网络自检控制器
 * 控制网络自检视图的网络自检功能的显示
 * */
.controller('NetworkCheckCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {
    var self = this;
    self.running = false;
    self.loading = false;
    self.step = 'step_1';
    self.step_text = '';
    self.step_img = 'img/1.png';
    self.result = '';
    
    self.start = function() {
        
    };
}])
/* 
 * 编辑快捷登录列表视图控制器
 * 主要显示用户快捷登录功能及自动登录功能的CRUD
 * */
.controller('EditQuickLoginCtrl', ['$q', '$timeout', '$interval', '$location', function($q, $timeout, $interval, $location) {

    var self = this;
    // 快捷登录列表
    this.list = [
        {
            name: 'name-01',
            username: 'username-01',
            password: 'dfwregrd',
            desktop: 'instancename-01',
            ag_address: '124.23.40.5',
            auto: 'auto'
        },{
            name: 'name-02',
            username: 'username-02',
            password: 'dfwregrd',
            desktop: 'instancename-02',
            ag_address: '124.23.40.5',
            auto: 'manual'
        }
    ];
    // 添加
    this.showAdd = false;
    this.mode = 'create';
    this.editData = {
        name: '',
        username: '',
        password: '',
        desktop: '',
        ag_address: '',
        auto: 'auto'
    };
    this.del_index = null;
    this.showDel = false;
    
    // 添加编辑 快捷登录
    this.addQuicklyLogin = function(mode, index) {
        this.showAdd = true;
        if(mode == 'edit') {
            this.mode = 'edit';
            this.editData = this.list[index];
        } else {
            this.mode = 'create';
            this.editData = {
                name: '',
                username: '',
                password: '',
                desktop: '',
                ag_address: '',
                auto: 'auto',
            };
        }
    };
    
    this.cancelAdd = function() {
        this.showAdd = false;
    };
    
    this.confirmAdd = function() {
        this.showAdd = false;
        console.log(this.editData);
    };
    
    // 删除快捷登录
    this.delLoginItem = function(index) {
        this.del_index = index;
        this.showDel = true;
    };
    
    this.cancelDel = function() {
        this.del_index = null;
        this.showDel = false;
    };
    
    this.confirmDel = function() {
        this.showDel = false;
    };

}])
/* 
 * 快速登录控制器
 * 快速登录视图的进入控制
 * */
.controller('QuickLoginCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {

    var self = this;

    this.list = [
        {
            name: 'name-01',
        },
        {
            name: 'name-02',
        }
    ];
    this.progress_rate = {
        style: {"width": "0%"},
        show_value: '0%',
        value: 0
    };
	this.showProgressCancel = false;
    this.showLoading = false;
    this.logged_index = 0;
    this.showTimeout = false;
    this.btn_status = false;
    this.showPaRequires = false;
    this.input_password = '';


    // 请求超时
    this.confirmRetry = function() {
        this.showTimeout = false;

    };
    
    this.cancelGiveUp = function() {
        this.showTimeout = false;
        this.btn_status = false;
    };
	
    // 登录加载
	this.cancelProgress = function() {
		
	};

    // 密码登录
    this.confirmLogin = function() {
        this.showPaRequires = false;
        this.input_password = '';
    };

    this.cancelLogin = function() {
        this.showPaRequires = false;
        this.input_password = '';
    };

    // 快捷登录
    this.quickLogin = function(index) {
        this.showPaRequires = true;
        this.logged_index = index;
        
    };

}])
/* 
 * 用户密码修改控制器
 * 控制用户密码修改功能的显示
 * */
.controller('UserChangePasswordCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {
    
    var self = this;

    this.old_pwd = '';
    this.new_pwd = '';
    this.cfm_pwd = '';
    
    this.applyChangePw = function() {
        
    };
    
}])
/* 
 * 有线网络控制器
 * 有线网络视图的设置
 * */
.controller('NetworkCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {

    var self = this;

    this.list = [
        {
            name: 'network-01',
            gateway: '10.10.10.150',
            gateway_proxy: true,
            spare_gateway: '10.10.10.151',
            spare_gateway_proxy: false,
            address_mode: 'auto',
            ag_address: '192.168.20.8',
            netmask: '',
            default_gateway: ''
        },
        {
            name: 'network-02',
            gateway: '10.10.10.150',
            spare_gateway: '10.10.10.151',
            address_mode: 'manual',
            ag_address: '192.168.20.7',
            netmask: '172.168.5.0',
            default_gateway: '10.10.10.152'
        }
    ];
    this.showAdd = false;
    this.mode = 'create';
    this.editData = {
        name: '',
        gateway: '',
        gateway_proxy: false,
        spare_gateway: '',
        spare_gateway_proxy: false,
        address_mode: 'manual',
        ag_address: '',
        netmask: '',
        default_gateway: ''
    };
    this.showDel = false;
    this.del_index = null;

    // 添加编辑 网络
    this.addNetwork = function(mode, index) {
        this.showAdd = true;
        if(mode == 'edit') {
            this.mode = 'edit';
            this.editData = this.list[index];
        } else {
            this.mode = 'create';
            this.editData = {
                name: '',
                gateway: '',
                gateway_proxy: false,
                spare_gateway: '',
                spare_gateway_proxy: false,
                address_mode: 'manual',
                ag_address: '',
                netmask: '',
                default_gateway: ''
            };
        }
    };

    this.cancelAdd = function() {
        this.showAdd = false;

    };

    this.confirmAdd = function() {
        this.showAdd = false;

    };

    // 删除网络
    this.delNetwork = function(index) {
        this.del_index = index;
        this.showDel = true;
    };

    this.cancelDel = function() {
        this.showDel = false;
    };

    this.confirmDel = function() {
        this.showDel = false;
    };
}])
/* 
 * 网络诊断控制器
 * 控制网络诊断视图的功能
 * */
.controller('NetworkDiagnosisCtrl', ['$q', '$timeout', '$interval', '$location', function($q, $timeout, $interval, $location){

    var self = this;
    
    self.methods = [{"_key": 1,"name": "PING"}, {"_key": 2,"name": i18nFilter('trace_route')}];
    self.method = self.methods[0];
    self.dst_address = '';
    self.times = 0;
    self.is_running = false;
    self.results = '';
    
    self.start = function() {
         
    };
    
    self.stop = function() {
         
    };
    
}])
/* 
 * 设备信息控制器
 * 设备信息视图及修改接入网关
 * */
.controller('SystemDeviceInfoCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {

    var self = this;
    
    this.deviceInfo = {
        name: 'device_name',
        id: '4563fdvwtr8y3jdjiu4w598kviuret705',
        mac_version: '1.2.0',
        android_version: '1.3.0',
        rom_version: '1.2.1',
        client_version: '1.2.4',
    };
    this.showReset = false;
    
    // 终端恢复出厂设置
    this.reset = function() {
        this.showReset = true;
    };

    this.cancelReset = function() {
        this.showReset = false;
    };

    this.confirmReset = function() {
        this.showReset = false;
    };

    // 检测新版本
    this.checkNewVersion = function() {

    };
    
}])
/* 
 * 安全设置密码控制器
 * 主要完成安全设置密码的
 * */
.controller('ChangeSecurityPasswordCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {

    var self = this;

    this.old_pwd = '';
    this.new_pwd = '';
    this.cfm_pwd = '';
        
    this.applyChange = function() {
        
    };
}])
/* 
 * 语言设置控制器
 * 语言设置功能的显示
 * */
.controller('LangueCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {
    
    var self = this;
    
    this.selectLange = '';
    this.langeOptions = [ 'Chinese', 'English' ];
    this.applyChange = function() {
        
    };
    
    
}])
/* 
 * 开发者选项控制器
 * 控制开发者选项功能的显示
 * */
.controller('DeveloperOptionsCtrl', ['$scope', '$q', '$timeout', '$interval', '$location', function($scope, $q, $timeout, $interval, $location) {
    
    var self = this;

    this.enableDebug = false;
    this.directDebug = false;

    this.proxyDebug = false;
    this.proxyAddress = '';
    this.directAddress = '';

    // 启用调试模式
    this.enableDebug = function() {
        
    };

    // 直连 调试
    this.directDebug = function() {

    };

    // 直连代理
    this.proxyDebug = function() {

    };

    this.debugConnect = function() {
        
    };

}])
