const events = ['greet', 'create-client']
const vm = new Vue({
    el: '#app',
    data: {
        connected: false,
        emitData: {
            event: 'greet',
            message: '',
            events: events
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
socket.on('disconnect', () => {
    vm.connected = false
})
events.forEach(event => {
    socket.on(event, msg => {
        vm.listenData.event = event
        vm.listenData.message = msg
    })
})
