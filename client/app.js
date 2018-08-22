(function(Vue) {

    const pad = (num, n) => (Array(n).join(0) + num).slice(-n)

    const convertDuration = duration => {
        const h = Math.floor(duration / 3600)
        const m = Math.floor(duration % 3600 / 60)
        const s = Math.floor(duration % 60)
        return h ? `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}` : `${pad(m, 2)}:${pad(s, 2)}`
    }

    /**
     * 加载模板内容
     * @param  {string} id 模板ID
     * @return {string}    模板内容
     */
    const loadTemplate = name => document.getElementById(name + '_tmpl').innerHTML

    // 定义组件
    const Home = {
        template: loadTemplate('home')
    }

    const List = {
        template: loadTemplate('list'),
        data() {
            this.$http.jsonp('http://localhost:2080/api/music')
                .then(res => {
                    this.list = res.data
                })

            return {
                list: []
            }
        },
        methods: {
            pad: pad,
            convert: convertDuration
        }
    }

    const Item = {
        template: loadTemplate('item'),
        data() {
            return {
                item: {}
            }
        },
        route: {
            data(transition) {
                const id = parseInt(transition.to.params.id)

                if (!id) {
                    router.go({
                        name: 'list'
                    })
                    return
                }

                this.$http.jsonp('http://localhost:2080/api/music/' + id)
                    .then(res => {
                        if (!res.ok) {
                            router.go({
                                name: 'list'
                            })
                        }
                        this.item = {
                            current: 0,
                            playing: false,
                            random: false
                        }
                        console.log(res.data)
                        Object.assign(this.item, res.data)
                        console.log(this.item.duration)
                        App.audio.src = this.item.music
                        App.audio.autoplay = true

                        App.audio.addEventListener('loadedmetadata', () => {
                            this.item.duration = App.audio.duration
                            console.log(this.item.duration)
                        })
                        App.audio.addEventListener('timeupdate', () => {
                            this.item.current = App.audio.currentTime
                        })
                        App.audio.addEventListener('play', () => {
                            this.item.playing = true
                        })
                        App.audio.addEventListener('pause', () => {
                            this.item.playing = false
                        })
                    })

                return {
                    item: {}
                }
            }
        },
        methods: {
            convert: convertDuration,
            play() {
                if (this.item.playing) {
                    App.audio.pause()
                } else {
                    App.audio.play()
                }
                this.item.playing = !this.item.playing
            },
            progress() {
                App.audio.currentTime = this.item.current
            },
            next() {
                this.$http.jsonp('http://localhost:2080/api/music')
                    .then(res => {
                        // console.log(res.data)
                        const ids = res.data.map(s => s.id)

                        let targetIndex = ids.indexOf(this.item.id) + 1

                        if (targetIndex > ids.length - 1) {
                            targetIndex = 0
                        }

                        router.go({
                            name: 'item',
                            params: {
                                id: ids[targetIndex]
                            }
                        })
                    })
            },
            prev() {
                this.$http.jsonp('http://localhost:2080/api/music')
                    .then(res => {
                        // console.log(res.data)
                        const ids = res.data.map(s => s.id)

                        let targetIndex = ids.indexOf(this.item.id) - 1

                        if (targetIndex < 0) {
                            targetIndex = ids.length - 1
                        }

                        router.go({
                            name: 'item',
                            params: {
                                id: ids[targetIndex]
                            }
                        })
                    })
            }
        }
    }

    // 路由器需要一个根组件。
    // 出于演示的目的，这里使用一个空的组件，直接使用 HTML 作为应用的模板
    const App = {}
    App.audio = new Audio()
    //var App = Vue.extend({})

    // 创建一个路由器实例
    // 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
    const router = new VueRouter()

    // 定义路由规则
    // 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend
    // 创建的组件构造函数，也可以是一个组件选项对象。
    // 稍后我们会讲解嵌套路由
    router.map({
        '/home': {
            name: 'home',
            component: Home
        },
        '/songs': {
            name: 'list',
            component: List
        },
        '/songs/:id': {
            name: 'item',
            component: Item
        }
    })

    // 任意其他地址跳转到 home
    router.redirect({
        '*': '/home'
    })

    // 现在我们可以启动应用了！
    // 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
    router.start(App, '#app')

})(Vue);
