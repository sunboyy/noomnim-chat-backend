const vm = new Vue({
    el: '#app',
    data: {
        connected: false,
        emitData: {
            event: '',
            message: '',
            events: ['', 'greet']
        },
        listenData: {
            event: '',
            message: null
        }
    },
    methods: {
        emit() {
            socket.emit(this.emitData.event, this.emitData.message)
        }
    }
})
const socket = io()
socket.on('connect', () => {
    vm.connected = true
})
const events = ['greet']
events.forEach(event => {
    socket.on(event, msg => {
        console.log('yay')
        vm.listenData.event = event
        vm.listenData.message = msg
    })
})
