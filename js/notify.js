/**
 * 定义消息提示及错误码常量
 */
angular.module('xDeskApp')
.constant('APP_NOTIFY', {
    "quickLogin": { // 错误码:E01XXXX
        "init": { // 错误码:E0101XX
            "error": {"title": "error", "code": "E010101", "msg": "MSG_E010101", "type": "danger"}
        },
        "update": { // 错误码:E0102XX
            "error": {"title": "error", "code": "E010201", "msg": "MSG_E010201", "type": "danger"}
        },
        "add": { // 错误码:E0103XX
            "error": {"title": "error", "code": "E010301", "msg": "MSG_E010301", "type": "danger"}
        },
        "keyConllision": { // 错误码:E0104XX
            "error": {"title": "error", "code": "E010401", "msg": "MSG_E010401", "type": "danger"}
        },
        "del": { // 错误码:E0105XX
            "error": {"title": "error", "code": "E010501", "msg": "MSG_E010501", "type": "danger"}
        },
        "notFound": { // 错误码:E0106XX
            "error": {"title": "notify", "code": "N010601", "msg": "MSG_N010601", "type": "info"}
        },
        "destroy": { // 错误码:E0107XX
            "error": {"title": "error", "code": "E010701", "msg": "MSG_E010701", "type": "danger"}
        },
        "passwordInput": {  // 错误码:E0108XX
            "empty": {"title": "error", "code": "E010801", "msg": "MSG_E010801", "type": "warning"}
        }
    },
    "system": { // 错误码:E02XXXX
        "reboot": { // 错误码:E0201XX
            "error": {"title": "error", "code": "E020101", "msg": "MSG_E020101", "type": "danger"}
        },
        "shutoff": { // 错误码:E0202XX
            "error": {"title": "error", "code": "E020201", "msg": "MSG_E020201", "type": "danger"}
        },
        "processStop": { // 错误码:E0203XX
            "error": {"title": "error", "code": "E020301", "msg": "MSG_E020301", "type": "danger"}
        },
        "deviceInfoGet": { // 错误码:E0204XX
            "error": {"title": "error", "code": "E020401", "msg": "MSG_E020401", "type": "danger"}
        },
        "ntpSet": { // 错误码:E0205XX
            "error": {"title": "error", "code": "E020501", "msg": "MSG_E020501", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0205", "type": "success"}
        },
        "ntpGet": { // 错误码:E0206XX
            "error": {"title": "error", "code": "E020601", "msg": "MSG_E020601", "type": "danger"}
        },
        "datetimeSet": { // 错误码:E0207XX
            "error": {"title": "error", "code": "E020701", "msg": "MSG_E020701", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0207", "type": "success"}
        },
        "datetimeGet": { // 错误码:E0208XX
            "error": {"title": "error", "code": "E020801", "msg": "MSG_E020801", "type": "danger"}
        },
        "factoryReset": { // 错误码:E0209XX
            "error": {"title": "error", "code": "E020901", "msg": "MSG_E020901", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0209", "type": "success"}
        },
        "langueGet": { // 错误码:E0210XX
            "error": {"title": "error", "code": "E021001", "msg": "MSG_E021001", "type": "danger"},
        },
        "langueSet": { // 错误码:E0211XX
            "error": {"title": "error", "code": "E021101", "msg": "MSG_E021101", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0211", "type": "success"}
        },
        "update": { // 错误码:E0212XX
            "error": {"title": "error", "code": "E021201", "msg": "MSG_E021201", "type": "danger"},
            "hasUpdateError": {"title": "error", "code": "E021202", "msg": "MSG_E021202", "type": "danger"},
            "localUpdateError": {"title": "error", "code": "E021203", "msg": "MSG_E021203", "type": "danger"},
            "getLocalVersionError": {"title": "error", "code": "E021204", "msg": "MSG_E021204", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0212", "type": "success"}
        },
        "developerOptions": { // 错误码:E0213XX
            "addressIncorrect": {"title": "error", "code": "E021301", "msg": "MSG_E021301", "type": "danger"}
        },
        "setUpdateServer": { // 错误码:E0214XX
            "error": {"title": "error", "code": "E021401", "msg": "MSG_E021401", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0214", "type": "success"}
        },
        "getUpdateServer": { // 错误码:E0215XX
            "error": {"title": "error", "code": "E021501", "msg": "MSG_E021501", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0215", "type": "success"},
            "empty": {"title": "error", "code": "E021503", "msg": "MSG_E021503", "type": "warning"},
        }
    },
    "login": { // 错误码:E03XXXX
        "tokenGet": { // 错误码:E0301XX
            "error": {"title": "error", "code": "E030101", "msg": "MSG_E030101", "type": "danger"},
            "wrong": {"title": "error", "code": "E030102", "msg": "MSG_E030102", "type": "danger"}
        },
        "resourceGet": { // 错误码:E0302XX
            "error": {"title": "error", "code": "E030201", "msg": "MSG_E030201", "type": "danger"}
        },
        "addressGet": { // 错误码:E0303XX
            "error": {"title": "error", "code": "E030301", "msg": "MSG_E030301", "type": "danger"},
            "hostShutOff": {"title": "notify", "code": "N030302", "msg": "MSG_N030302", "type": "info"},
            "forbidden": {"title": "error", "code": "E030303", "msg": "MSG_E030303", "type": "danger"}
        },
        "loggedInfoWrite": { // 错误码:E0304XX
            "error": {"title": "error", "code": "E030401", "msg": "MSG_E030401", "type": "danger"}
        },
        "showNameWrite": { // 错误码:E0305XX
            "error": {"title": "error", "code": "E030501", "msg": "MSG_E030501", "type": "danger"}
        },
        "passwordChange": { // 错误码:E0306XX
            "diff": {"title": "notify", "code": "N030601", "msg": "MSG_N030601", "type": "warning"},
            "error": {"title": "error", "code": "E030602", "msg": "MSG_E030602", "type": "danger"},
            "wrong": {"title": "error", "code": "E030603", "msg": "MSG_E030603", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0306", "type": "success"}
        }
    },
    "securityPassword": { // 错误码:E04XXXX
        "check": { // 错误码:E0401XX
            "error": {"title": "error", "code": "E040101", "msg": "MSG_E040101", "type": "danger"},
            "wrong": {"title": "error", "code": "E040102", "msg": "MSG_E040102", "type": "warning"}
        },
        "change": { // 错误码:E0402XX
            "diff": {"title": "notify", "code": "N040201", "msg": "MSG_N040201", "type": "warning"},
            "wrong": {"title": "error", "code": "E040202", "msg": "MSG_E040202", "type": "danger"},
            "error": {"title": "error", "code": "E040203", "msg": "MSG_E040203", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0402", "type": "success"}
        }
    },
    "display": { // 错误码:E05XXXX
        "resolutionSet": { // 错误码:E0501XX
            "error": {"title": "error", "code": "E050101", "msg": "MSG_E050101", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0501", "type": "success"}
        },
        "resolutionGet": { // 错误码:E0502XX
            "error": {"title": "error", "code": "E050201", "msg": "MSG_E050201", "type": "danger"}
        },
        "modeGet": { // 错误码:E0503XX
            "error": {"title": "error", "code": "E050301", "msg": "MSG_E050301", "type": "danger"}
        },
        "modeSet": { // 错误码:E0504XX
            "error": {"title": "error", "code": "E050401", "msg": "MSG_E050401", "type": "danger"},
            "needTwoDisplay": {"title": "error", "code": "E050402", "msg": "MSG_E050402", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0504", "type": "success"}
        },
        "lightenessSet": { // 错误码:E0505XX
            "error": {"title": "error", "code": "E050501", "msg": "MSG_E050501", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0505", "type": "success"}
        },
        "lightenessGet": { // 错误码:E0506XX
            "error": {"title": "error", "code": "E050601", "msg": "MSG_E050601", "type": "danger"}
        }
    },
    "sound": { // 错误码:E06XXXX
        "volumeGet": { // 错误码:E0601XX
            "error": {"title": "error", "code": "E060101", "msg": "MSG_E060101", "type": "danger"}
        },
        "volumeSet": { // 错误码:E0602XX
            "error": {"title": "error", "code": "E060201", "msg": "MSG_E060201", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0602", "type": "success"}
        },
        "muteGet": { // 错误码:E0603XX
            "error": {"title": "error", "code": "E060301", "msg": "MSG_E060301", "type": "danger"}
        },
        "muteSet": { // 错误码:E0604XX
            "error": {"title": "error", "code": "E060401", "msg": "MSG_E060401", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0604", "type": "success"}
        },
        "audioCardsGet": { // 错误码:E0605XX
            "error": {"title": "error", "code": "E060501", "msg": "MSG_E060501", "type": "danger"}
        },
        "audioCardsSet": { // 错误码:E0606XX
            "error": {"title": "error", "code": "E060601", "msg": "MSG_E060601", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0606", "type": "success"}
        }
    },
    "usb": { // 错误码:E07XXXX
        "deviceGet": { // 错误码:E0701XX
            "error": {"title": "error", "code": "E070101", "msg": "MSG_E070101", "type": "danger"}
        },
        "localAccessSet": { // 错误码:E0702XX
            "error": {"title": "error", "code": "E070201", "msg": "MSG_E070201", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0702", "type": "success"}
        },
        "localAccessGet": { // 错误码:E0703XX
            "error": {"title": "error", "code": "E070301", "msg": "MSG_E070301", "type": "danger"}
        },
        "bootAccessWrite": { // 错误码:E0704XX
            "error": {"title": "error", "code": "E070401", "msg": "MSG_E070401", "type": "danger"}
        },
        "serverConfigGet": { // 错误码:E0705XX
            "error": {"title": "error", "code": "E070501", "msg": "MSG_E070501", "type": "danger"}
        }
    },
    "network": { // 错误码:E08XXXX
        "modeSet": { // 错误码:E0801XX
            "error": {"title": "error", "code": "E080101", "msg": "MSG_E080101", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0801", "type": "success"}
        },
        "modeGet": { // 错误码:E0802XX
            "error": {"title": "error", "code": "E080201", "msg": "MSG_E080201", "type": "danger"}
        },
        "gatewayGet": { // 错误码:E0803XX
            "error": {"title": "error", "code": "E080301", "msg": "MSG_E080301", "type": "danger"}
        },
        "localIpGet": { // 错误码:E0804XX
            "notFound": {"title": "error", "code": "E080401", "msg": "MSG_E080401", "type": "danger"},
            "error": {"title": "error", "code": "E080402", "msg": "MSG_E080402", "type": "danger"}
        },
        "statusGet": { // 错误码:E0805XX
            "error": {"title": "error", "code": "E080501", "msg": "MSG_E080501", "type": "danger"}
        },
        "autoCheck": { // 错误码:E0806XX
            
        },
    },
    "ag": { // 错误码:E09XXXX
        "activeGet": { // 错误码:E0901XX
            "notFound": {"title": "error", "code": "E090101", "msg": "MSG_E090101", "type": "danger"}
        },
        "mainGet": { // 错误码:E0902XX
            "error": {"title": "error", "code": "E090201", "msg": "MSG_E090201", "type": "danger"},
        },
        "reserveGet": { // 错误码:E0903XX
            "error": {"title": "error", "code": "E090301", "msg": "MSG_E090301", "type": "danger"},
        },
        "set": { // 错误码:E0904XX
            "error": {"title": "error", "code": "E090401", "msg": "MSG_E090401", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S0904", "type": "success"}
        },
    },
    "service": { // 错误码:E10XXXX
        "typeGet": { // 错误码:E1001XX
            "notFound": {"title": "error", "code": "E100101", "msg": "MSG_E100101", "type": "danger"}
        }
    },
    "snapshot": { // 错误码:E11XXXX
        "revert": { // 错误码:E1101XX
            "error": {"title": "error", "code": "E110101", "msg": "MSG_E110101", "type": "danger"}
        }
    },
    "shortcutKey": { // 错误码:E12XXXX
        "hide": { // 错误码:E1201XX
            "error": {"title": "error", "code": "E120101", "msg": "MSG_E120101", "type": "danger"}
        }
    },
    "instance": {  // 错误码:E13XXXX
        "boot": { // 错误码:E1301XX
            "error": {"title": "error", "code": "E130101", "msg": "MSG_E130101", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S1301", "type": "success"}
        },
        "shutoff": { // 错误码:E1302XX
            "error": {"title": "error", "code": "E130201", "msg": "MSG_E130201", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S1302", "type": "success"}
        },
        "reboot": { // 错误码:E1303XX
            "error": {"title": "error", "code": "E130301", "msg": "MSG_E130301", "type": "danger"},
            "success": {"title": "success", "msg": "MSG_S1303", "type": "success"}
        }
    }
})