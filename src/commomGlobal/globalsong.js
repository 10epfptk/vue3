export default {
    install(Vue) {
        Vue.config.globalProperties.$songemptyValidation = function(jsonvar) {

            return jsonvar.every(element => {
                if(this.$refs[element.itemname].value == '') {
                    this.$swal({
                        title: element.emptymsg,
                    });
                    return false;
                }
                return true;
            });
            
            // let jsondataarr = JSON.parse(JSON.stringify(this.$data));

            // //let keys = Object.keys(jsondataarr); //키를 가져옵니다. 이때, keys 는 반복가능한 객체가 됩니다.
            // //for (let i = 0; i < keys.length; i++) {
            // //  let key = keys[i];
            // //  console.log('key : ' + key + ', value : ' + jsondataarr[key]);
            // //}

            // jsonvar.forEach((element) => {
            //     //console.log(element.itemname + ' : ' + element.emptymsg);

            //     if (jsondataarr[element.itemname] == '') {
            //         alert(element.emptymsg);
            //         return false;
            //     }
            // });

            // return true;
        };
    },
};