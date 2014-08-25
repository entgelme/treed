
var merge = require('react/lib/merge')

var MainStore = require('../stores/main')
var Db = require('../db')

module.exports = {
  run: run
}

function run(options, done) {
  if (arguments.length === 1) {
    done = options
    options = {}
  }
  options = merge({
    plugins: [],
    children: require('./demo-data'),
  }, options)
  if (!options.PL) {
    options.PL = require('../pl/mem')
  }

  var pl = new options.PL()
  var db = new Db(pl)
  db.init(function (err) {
    if (err) return console.error('Failed to start db', err);
    if (options.children) {
      db.dump(db.root, options.children)
    }

    var plugins = []
    options.plugins.forEach((plugin) => {
      if (plugin.store) plugins.push(plugin.store)
    })

    var store = new MainStore({
      plugins: plugins,
      pl: db
    })

    window.store = store
    window.actions = store.actions
    done(store)
  })
}