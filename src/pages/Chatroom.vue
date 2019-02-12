<template>
    <div>
        <header >Your Chatroom</header>
        <div class="main">
            <div class="aside">
                <div class="aside-header">在线人员({{showNum}})</div>
                <div v-for="(value, key) in nickNameList" :key="value">
                    <p>{{key}}: {{value}}</p>
                </div>
            </div>
            <div class="message">
                <template v-if="isLog">
                    <div v-for="(item,index) in items" :key="index">
                        <span v-if="item.name">{{item.name}}: </span>
                        <span>{{item.msg}}</span>
                    </div>
                </template>
                <div v-else>
                    <button @click="isShowDialog=true">设置昵称</button>
                    <!-- <input type="text" v-model="setName" @keyup.enter="setNickName">
                    <button @click="setNickName" placeholder="设置昵称">设置昵称</button> -->
                </div>
            </div>
        </div>
        <footer class="footer">
            <input type="text" v-model="input" @keyup.enter="sendMsg" placeholder="发送信息">
            <button @click="sendMsg">发送</button>
        </footer>

        <!-- 需要.sync对prop进行“双向绑定” -->
        <el-dialog
            :visible.sync="isShowDialog"
            :close-on-click-modal="true"
            title="设置昵称"
            :center="true"
        >
            <input type="text" placeholder="设置你的昵称" v-model="setName" @keyup.enter="setNickName">
            <div slot="footer" class="dialog-footer">
                <button @click="isShowDialog=false">取 消</button>
                <button @click="setNickName">确 定</button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const io = require('socket.io-client');
// 为什么这种方式没有导入io why
// import * as io from 'socket.io-client';
const socket = io();

export default {
    name: 'chatroom',

    data() {
        return {
            isLog: false,
            isShowDialog: false,
            setName: '',
            nickName: '',
            nickNameList: () => ({}),
            items: [],
            input: '',
            lastInput: ''
        };
    },

    mounted() {
        this.init();
    },

    computed: {
        showNum() {
            const { nickNameList } = this;
            let sum = 0;
            let onlineNum = 0;
            for (let nickName in nickNameList) {
                sum++;
                if (nickNameList[nickName] === 'online') onlineNum++;
            }
            return `${onlineNum}/${sum}`;
        }
    },

    methods: {
        init() {
            this.onReceiveMsg();
            this.onUserLogIn();
            this.onUserLogOut();
            this.onLogIn();
        },

        // 输入处理 todo
        sendMsg() {
            if (!this.isLog) {
                this.isShowDialog = true;
                return;
            }
            const { input, oldInput } = this;
            if (!input) {
                console.log('输入为空');
                return;
            }

            if (input === oldInput) {
                // 弹窗显示
                console.log('请不要重复输入');
                return;
            }
            socket.emit('sendMsg', input);
            this.oldInput = input;
            this.input = '';
        },

        // 输入处理 不要用ws Todo
        setNickName() {
            const { setName } = this;
            this.isShowDialog = false;
            if (!setName) {
                console.log('输入为空');
                return;
            }
            socket.emit('setNickName', this.setName);
            this.setName = '';
        },

        onReceiveMsg() {
            socket.on('receiveMsg', (data) => {
                this.items.push(data);
            });
        },

        onUserLogIn() {
            socket.on('userLogIn', (nickName) => {
                const hi = { msg: `${nickName} come in` };
                this.items.push(hi);
            });
        },

        onUserLogOut() {
            socket.on('userLogout', (nickName, nickNameList) => {
                const attention = { msg: `${nickName} go out` };
                this.items.push(attention);
                this.nickNameList = nickNameList;
            });
        },

        onLogIn() {
            socket.on('logIn', ({ status, nickName, nickNameList }) => {
                if (!status) {
                    console.log('设置昵称重复，请重新输入');
                    return;
                }

                this.nickName = nickName;
                this.nickNameList = nickNameList;
                this.isLog = true;
            });
        }
    }
};
</script>

<style lang="less">
.main {
    display: flex;
    height: 500px;
}

.aside {
    width: 200px;
}

.message {
    flex: 1;
}

.footer {
    position: fixed;
    bottom: 0;
}
</style>
