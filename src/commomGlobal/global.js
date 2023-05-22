const methods = {
  emptyValidation(jsonvar) {
    console.log(JSON.stringify(jsonvar));

    let result = true;
    jsonvar.every((element) => {
      if (element.itemname.trim() == '') {
        this.$swal(element.emptymsg);
        console.log('element.itemname : ' + element.itemname);
        console.log('element.emptymsg : ' + element.emptymsg);

        result = false;
      }

      return result;
    });
    console.log(result);
    return result;
  },
};

export default {
  install(Vue) {
    Vue.config.globalProperties.$emptyValidation = methods.emptyValidation;
  },
};
