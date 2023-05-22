<template>
    <p class="Location">
        <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
        <span class="btn_nav bold">학습 관리</span> <span
            class="btn_nav bold">과제 관리</span>
    </p>
    <p class="conTitle" id="lecselect">
        <span>과제 목록</span> <span class="fr"> 
            <select id="lecselect" name="lecselect" style="width: 150px;" v-model="lecseq" @change="tasklists()">
                <option value=0>강의 선택</option>
                <option v-for="(seq, index) in lecseqlist" :value="seq" :key="index">{{ lecnamelist[index] }}</option>
            </select>
            <a	class="btnType blue" href="" @click.prevent="popup('I')" name="modal"><span>과제 생성</span></a>
        </span>
    </p>
    
    
    <div id="taskList">
            
        <table class="col">
            <caption>caption</caption>
            <colgroup>
                <col width="20%">
                <col width="20%">
                <col width="15%">
                <col width="15%">
                <col width="20%">
                <col width="10%">
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">강의명</th>
                    <th scope="col">과제명</th>
                    <th scope="col">시작일자</th>
                    <th scope="col">마감일자</th>
                    <th scope="col">과정기간</th>
                    <th scope="col">수정</th>
                </tr>
            </thead>
            <template v-if="taskcnt === 0">
                <tbody>
                    <tr>
                        <td colspan="6">데이터가 존재하지 않습니다.</td>
                    </tr>
                </tbody>
            </template>
            <template v-else>
                <tbody id="tbodytasklist" v-for="task in tasklist" :key="task.taskinfo_seq">
                    <tr @click="tinfolists(task.taskinfo_seq)">
                        <td>{{ task.lec_name }}</td>
                        <td>{{ task.task_name }}</td>
                        <td>{{ task.task_st }}</td>
                        <td>{{ task.task_ed }}</td>
                        <td>{{ task.lec_st }} ~ {{ task.lec_ed }}</td>
                        <td @click.stop="Upopup(task.taskinfo_seq)">
                            <a class="btnType3 color2">
                                <span>수정</span>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </template>
        </table>
    </div>
    <div>
        <paginate
            class="justify-content-center"
            v-model="taskpagenum"
            :page-count="tasktotalpage"
            :page-range="5"
            :margin-pages="0"
            :click-handler="tasklistsearch"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'"
        >
        </paginate>
    </div>
    <br>
    <div id="taskinfo" v-show="display">
        <p class="conTitle">
            <span>과제 제출 정보</span>
        </p>
        
        <div id="taskList">
            <table class="col">
            
                <caption>caption</caption>
                <colgroup>
                    <col width="20%">
                    <col width="20%">
                    <col width="20%">
                    <col width="20%">
                    <col width="20%">
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col">학번</th>
                        <th scope="col">학생명</th>
                        <th scope="col">연락처</th>
                        <th scope="col">제출시간</th>
                        <th scope="col">과제 다운로드</th>
                    </tr>
                </thead>
                
            <template v-if="tinfotaskcnt === 0">
                <tbody>
                    <tr>
                        <td colspan="5">데이터가 존재하지 않습니다.</td>
                    </tr>
                </tbody>
            </template>
            <template v-else>
                <tbody id="tbodytasklist" v-for="task in tinfotasklist" :key="task.stu_num">
                    <tr>
                        <td>{{ task.stu_num }}</td>
                        <td>{{ task.ui_name }}</td>
                        <td>{{ task.ui_hp }}</td>
                        <td>{{ task.tasksend_date }}</td>
                        <td>
                            <template v-if="task.file_name">
                                <a href="" @click.prevent="download(task.file_seq, task.file_name)">{{ task.file_name }}</a>
                            </template>
                            <template v-else>
                                -
                            </template>
                        </td>
                    </tr>
                </tbody>
            </template>
                
            </table>
        </div>
        <paginate
            class="justify-content-center"
            v-model="tinfopagenum"
            :page-count="tinfototalpage"
            :page-range="5"
            :margin-pages="0"
            :click-handler="tinfolistsearch"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'"
        >
        </paginate>
    </div>
</template>
<script>
    import {openModal} from 'jenesius-vue-modal';
    import taskModal from './taskModal.vue';
    import Paginate from 'vuejs-paginate-next';

    export default{
        data : function(){
            return{

                lecnamelist: [],
				lecseqlist: [],
                lecseq: 0,
                taskpagenum: 1,
				taskpageSize: 5,
				taskcnt: 0,
				tasklist : [],
                tasktotalpage : 1,
                taskseq: 0,
                tinfopagenum: 1,
				tinfopageSize: 5,
				tinfotaskcnt: 0,
				tinfotasklist : [],
                tinfototalpage : 1,
                display: false,
                modaltaskseq : 0,
                action: '',

            }

        },
        components : {
            paginate : Paginate,
        },
        mounted(){
            this.boxselect();
        },
        methods : {
            page: function (total, page) {
                //var total = this.totalcnt;
                //var page = this.pagesize;
                var xx = total % page;
                var result = parseInt(total / page);

                if (xx == 0) {
                return result;
                } else {
                result = result + 1;
                return result;
                }
            },
            // selectbox 가져오기
            boxselect: function(){

                let vm = this;

                this.axios
                    .post("/tch/vueTasklecList.do")
                    .then(function(result){

                        
                        vm.lecnamelist = result.data.lecnamelist;
					    vm.lecseqlist = result.data.lecseqlist;

                    })
                    .catch(function(error){
                        alert('오류오류오류' + error);
                    });
            },
            tasklists: function(){

                this.taskpagenum = 1;

                this.tasklistsearch();

            },
            tasklistsearch: function(){

                this.display = false;

                let vm = this;

                let params = new URLSearchParams();

                params.append('pagenum',this.taskpagenum);
                params.append('pageSize',this.taskpageSize);
                params.append('lecseq',this.lecseq);

                this.axios
                    .post('/tch/vuetaskList.do', params)
                    .then(function(result){

                        vm.taskcnt = result.data.taskcnt;
					    vm.tasklist = result.data.tasklist;
                        vm.tasktotalpage = vm.page(vm.taskcnt, vm.taskpageSize)
                        console.log(vm.taskcnt);
                        console.log(vm.tasklist);

                    })
                    .catch(function(error){
                        alert('오류오류오류' + error);
                    });
            },
            tinfolists: function(taskseq){

                this.tinfopagenum = 1;
                
                this.display = true;

                this.taskseq = taskseq;

                console.log(this.taskseq);

                this.tinfolistsearch();

            },
            tinfolistsearch: function(){

                let vm = this;

                let params = new URLSearchParams();

                params.append('pagenum', this.tinfopagenum);
                params.append('pageSize', this.tinfopageSize);
                params.append('taskinfoseq', this.taskseq);

                this.axios
                    .post('/tch/vuetaskinfolist.do', params)
                    .then(function(result){

                        vm.tinfotasklist = result.data.taskinfolist;
					    vm.tinfotaskcnt = result.data.taskinfocnt;
                        vm.tinfototalpage = vm.page(vm.tinfotaskcnt, vm.tinfopageSize);
                        console.log(vm.tinfotasklist);
                        console.log(vm.tinfotaskcnt);

                    })
                    .catch(function(error){
                        alert('오류오류오류' + error);
                    });
            },
            Upopup: function(taskseq){

                this.modaltaskseq = taskseq;

                this.popup('U');

            },
            popup: async function(action){

                if(this.lecseq == 0){

                    this.$swal.fire({

                        title: '강의를 선택해 주세요.',
                        icon: 'error',
                        buttons: {
                            confirm: {
                                text: '확인',
                                value: true,
                                className: 'btn btn-outline-primary'
                            }
                        }

                    })
                    return;

                }

                this.action = action;
                console.log('modal seq : ' + this.lecseq);

                const modal = await openModal(taskModal, {

                    mlecseq: this.lecseq,
                    mtaskseq: this.modaltaskseq,
                    maction: this.action,

                });

                modal.onclose = (popupparam) => {

                    console.log('팝업 클로즈' + popupparam);
                    this.tasklistsearch();

                };

            },
            download: function (fileseq, filename) {

                let params = new URLSearchParams();

                params.append('fileseq', fileseq);

                this.axios
                .post('/tch/taskdownload.do', params)
                .then((resp) => {
                    //console.log(resp);
                    let FILE = window.URL.createObjectURL(new Blob([resp.data]));
                    //console.log('FILE : ' + FILE);
                    let docUrl = document.createElement('a');
                    docUrl.href = FILE;
                    docUrl.setAttribute('download', filename);
                    document.body.appendChild(docUrl);
                    docUrl.click();
                })
                .catch((error) => {
                    console.log(error);
                });
            },
        },
    };
</script>