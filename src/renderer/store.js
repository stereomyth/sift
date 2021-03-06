import Vue from 'vue';
import Vuex from 'vuex';

const fs = require('fs');
const { join, extname } = require('path');
const settings = require('electron').remote.require('electron-settings');

const exts = ['.gif', '.jpg', '.jpeg', '.png', '.webp', '.jfif'];

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    srcPath: '',
    destPath: '',
    ignore: [],

    images: [],
    destDirs: [],
    cursor: 0,
  },

  mutations: {
    config(state, obj) {
      Object.keys(obj).forEach(key => {
        state[key] = obj[key];
      });
    },

    save(state, obj) {
      Object.keys(obj).forEach(key => {
        settings.set(key, obj[key]);
      });
    },

    addIgnore(state, path) {
      state.ignore.push(path);
      settings.set('ignore', state.ignore);
    },

    focus(state, val) {
      state.cursor = val;
    },

    focusNext(state) {
      state.cursor = state.cursor < state.images.length - 1 ? state.cursor + 1 : 0;
    },

    focusPrev(state) {
      state.cursor = (state.cursor > 0 ? state.cursor : state.images.length) - 1;
    },

    getDestDirs(state) {
      if (state.destPath) {
        fs.readdir(state.destPath, { withFileTypes: true }, (error, items) => {
          state.destDirs = items
            .filter(d => d.isDirectory() && d.name.charAt(0) !== '.' && d.path !== state.srcPath)
            .map(d => ({ path: join(state.destPath, d.name), ...d }));
        });
      }
    },

    getSrcImgs(state) {
      // make recursive?
      if (state.srcPath) {
        fs.readdir(join(state.srcPath), (error, files) => {
          console.log(
            'discovered extensions:',
            [...new Set(files.map(f => extname(f).toLowerCase()))].filter(
              ext => ext && !exts.includes(ext)
            )
          );

          state.images = files
            .filter(filename => exts.includes(extname(filename).toLowerCase()))
            .map((file, i) => ({
              path: join(state.srcPath, file),
              ext: extname(file),
              filename: file,
              id: i,
            }));
        });
      }
    },
  },

  getters: {
    current: state => (state.images.length ? state.images[state.cursor] : {}),
    dirs: state => state.destDirs.filter(d => !state.ignore.includes(d.path)),
  },

  actions: {
    move({ state, commit, getters }, dir) {
      const oldPath = getters.current.path;
      const newPath = join(dir.path, getters.current.filename);

      console.log('moving', oldPath, newPath);

      fs.rename(oldPath, newPath, (error, file) => {
        state.images[state.cursor].path = newPath;
        commit('focusNext');
      });
    },

    config({ commit, state }, obj) {
      commit('config', obj);
      commit('save', obj);
      commit('getSrcImgs');
      commit('getDestDirs');
    },

    init({ commit }) {
      commit('config', settings.getAll());
      commit('getSrcImgs');
      commit('getDestDirs');
    },
  },
});
