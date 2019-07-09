// TODO: 간단화 하기

$(document).ready(function () {
    const {
        remote
    } = require('electron')
    const {
        Menu,
        MenuItem
    } = remote
    const customTitlebar = require('custom-electron-titlebar');
    var Titlebar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#2C2541')
    });

    function UpdateCheck() {
        var request = require("request")
        // TODO: uri.all.js.map, performance-now.js.map 버그 고치기 (취약점 가능)
        request({
                url: "https://api.github.com/repos/electron/electron/releases/latest",
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.121 Electron/5.0.6 Safari/537.36"
                }
            },
            function (err, res, body) {
                let gparse = JSON.parse(body)
                let CheckedVersion = gparse.tag_name;
                if (CheckedVersion.substring(1) > require('electron').remote.getGlobal('sharedObject').version) {
                    console.log("need update")
                    // TODO: 업데이트 알림 띄우고 확인 누르면 설치하기 (aot.js)
                    // TODO: Github Release 주소 TwitchAOT로 바꾸기
                    // getGlobal 쓰면 됨
                    /*         var downloadRelease = require('@terascope/fetch-github-release');
                    
                            // 릴리즈 필터
                            function filterRelease(release) {
                                return release.prerelease === false;
                            }
                            // 에셋 플랫폼 필터
                            function filterAsset(asset) {
                                // win32-x64 빌드만 다운로드
                                return asset.name.indexOf('win32-x64') >= 0;
                            }
                    
                            downloadRelease("twitchaot", "twitchaot", "./", filterRelease, filterAsset, false)
                                .then(function () {
                                    console.log('All done!');
                                })
                                .catch(function (err) {
                                    console.error(err.message);
                                }); */
                } else if (CheckedVersion.substring(1) == require('electron').remote.getGlobal('sharedObject').version) {
                    $("#update-banner").css("visibility", "visible");
                    $("#update-banner").addClass('slideInUp');
                    $("#update-banner").one("animationend", function () {
                        $(this).removeClass("slideInUp")
                        $(this).addClass("slideOutDown delay-1s slow")
                        $(this).one("animationend", function () {
                            $(this).removeClass("slideOutDown delay-1s slow")
                            $(this).css("visibility", "hidden");
                        });
                    });
                }
            });
    }
    const menu = new Menu();
    menu.append(new MenuItem({
        // TODO: 할 거 추가
        label: '$menu$',
        submenu: [{
                label: '업데이트 확인',
                click: () => UpdateCheck()
            },
            {
                label: '개발자 도구 열기',
                click: () => require('electron').remote.getCurrentWebContents().openDevTools()
            },
            {
                type: 'separator'
            },
            {
                label: "버전 v" + require('electron').remote.getGlobal('sharedObject').version
            },
            {
                label: '서드파티 라이브러리 정보',
            },
            {
                label: '환경설정',
            }
        ]
    }));
    menu.append(new MenuItem({
        label: '$resolution$',
        submenu: [{
                label: '1920x1080',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(1920, 1110)
            },
            {
                label: '1600x900',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(1600, 930)
            },
            {
                label: '1366x768',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(1366, 798)
            },
            {
                label: '1280x720',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(1280, 750)
            },
            {
                label: '960x540',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(960, 570)
            },
            {
                label: '640x360',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(640, 390)
            },
            {
                label: '535x301',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(535, 331)
            },
            {
                label: '400x225',
                click: () => require('electron').remote.getCurrentWindow().setContentSize(400, 255)
            }
        ]
    }));
    menu.append(new MenuItem({
        label: '$refresh$',
        click: () => window.location.reload(true)
    }));


    Titlebar.updateMenu(menu);

    $("input").on("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            $("#move").click();
        }
    });

});

let slink = `<iframe src="https://player.twitch.tv/?channel=0streamer0" frameborder="0" allowfullscreen="true" scrolling="no"
height="378" width="620"></iframe><a href="https://www.twitch.tv/0streamer0?tt_content=text_link&tt_medium=live_embed"
style="padding:2px 0px 4px; display:block; width:345px; font-weight:normal; font-size:10px; text-decoration:underline;">`
let clink = `<iframe src="https://www.twitch.tv/embed/0streamer0/chat" frameborder="0" scrolling="no" height="500" width="350"></iframe>`
$(document).ready(function () {
    $(".menubar-menu-title")[0].innerHTML = ""
    $(".menubar-menu-title")[0].className += " fa fa-bars"
    $(".menubar-menu-title")[1].innerHTML = ""
    $(".menubar-menu-title")[1].className += " fa fa-desktop"
    $(".menubar-menu-title")[2].innerHTML = ""
    $(".menubar-menu-title")[2].className += " fa fa-repeat"
});

function twitch_move() {
    // TODO: 빈칸일 경우에 dialog 띄우기
    let streamerid = $("input").val()
    $(".paper").remove()
    $(".container-fluid").remove()
    $(".container-after-titlebar").css('overflow', 'hidden')
    $(".container-after-titlebar").append(slink.replace(/0streamer0/gi, streamerid));
    $("iframe[height=378]").css('width', '100vw')
    $("iframe[height=378]").css('height', 'calc(100vh - 30px)')
}

function updatenofi() {
    $('#dialog').dialog({
        draggable: false,
        modal: true,
    });
    $(".ui-dialog").addClass("paper")
    $('.ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix').css("padding", ".2em .8em")
    $(".ui-widget-overlay").css("opacity", ".5")
}