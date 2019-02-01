<template>
    <div>
        <header >Your Chatroom</header>
        <div class="main">
            <div class="aside">在线人员</div>
            <div class="message">
                <template v-if="isLog">
                    <div v-for="(item,index) in items" :key="index">
                        <div>
                            <span v-if="item.name">{{item.name}}: </span>
                            <span>{{item.msg}}</span>
                        </div>
                    </div>

                    <div>
                        <input type="text" v-model="input" @keyup.enter="sendMsg" placeholder="发送信息">
                        <button @click="sendMsg">发送</button>
                    </div>
                </template>
                <div v-else>
                    <el-dialog
                        :title="'设置昵称'"
                        :center="true"
                    >
                        <input type="text" placeholder="设置你的昵称" v-model="setName">
                    </el-dialog>
                    <input type="text" v-model="setName" @keyup.enter="setNickName">
                    <button @click="setNickName" placeholder="设置昵称">设置昵称</button>
                </div>
            </div>
        </div>
        <footer>输入框</footer>
    </div>
</template>

<script>
// import { Dialog } from 'element-ui';

const io = require('socket.io-client');
// 为什么这种方式没有导入io why
// import * as io from 'socket.io-client';
const socket = io();

export default {
    name: 'chatroom',

    data() {
        return {
            isLog: false,
            setName: '',
            nickName: '',
            items: [],
            input: '',
            lastInput: ''
        };
    },

    mounted() {
        this.init();
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
            const { input, oldInput } = this;
            if (!input) {
                console.log('输入为空');
                return;
            }

            if (input === oldInput) {
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
            if (!setName) {
                console.log('输入为空');
                return;
            }
            socket.emit('setNickName', this.setName);
            this.nickName = this.setName;
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
            socket.on('userLogOut', (nickName) => {
                const attention = { msg: `${nickName} go out` };
                this.items.push(attention);
            });
        },

        onLogIn() {
            socket.on('logIn', ({ status, nickName }) => {
                if (!status) {
                    console.log('设置昵称重复，请重新输入');
                    return;
                }

                this.nickName = nickName;
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
</style>
