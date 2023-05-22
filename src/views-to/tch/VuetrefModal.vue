<template>
        <div id="refModalArea" class="layerType2" style="width:600px">
		<dl>
			<dt>
				<strong>학습자료 관리</strong>
			</dt>
			<dd class="content">
				<!-- s : 여기에 내용입력 -->
                <form>
				<table class="row" style="display: table; margin: auto;">
					<caption>caption</caption>
					<colgroup>
						<col width="15%">
						<col width="35%">
						<col width="15%">
						<col width="35%">
					</colgroup>
					<tbody>
                            {{ refInfo.lec_name }}
						<tr id="reftr" v-if="!modalType">
							<th scope="row">강의명<span class="font_red">*</span></th>
							<td><input type="text" class="inputTxt p100" name="lec_name" id="lec_name" v-model="refInfo.info.lec_name" readonly="true" style="border:none;outline:none;"/></td>
							<th scope="row">등록일<span class="font_red">*</span></th>
							<td><input type="text" class="inputTxt p100" name="ref_regdate" id="ref_regdate" v-model="refInfo.info.ref_regdate" readonly="true" style="border:none;outline:none;"/></td>
						</tr>
						<tr>
							<th scope="row">제목</th>
							<td colspan="3"><input type="text" class="inputTxt p100" name="ref_title" id="ref_title" v-model="refInfo.info.ref_title" ref="ref_title"/></td>
						</tr>
						<tr>
							<th scope="row">파일 </th>
							<td colspan=3><input type="file" class="inputTxt p100"	name="selfile" id="selfile"/>
						    </td>
						</tr>
					</tbody>
				</table>
                </form>

				<!-- e : 여기에 내용입력 -->

				<div class="btn_areaC mt30">
                    <template v-if="modalType">
                        <a href="" class="btnType blue" id="btninsert" name="btn" v-on:click.prevent="saveRef"><span>추가</span></a> 
                    </template>
                    <template v-else>
                        <a href="" class="btnType blue" id="btnupdate" name="btn" v-on:click.prevent="modRef"><span>수정</span></a> 
                        <a href="" class="btnType blue" id="btnDelete" name="btn" v-on:click.prevent="delRef"><span>삭제</span></a> 
                    </template>
					<a href="" class="btnType gray"  id="btnClose" name="btn" v-on:click.prevent="close"><span>취소</span></a>
				</div>
			</dd>
		</dl>
		<a href="" class="closePop" v-on:click.prevent="close"><span class="hidden">닫기</span></a>
	</div>
    <validation :value="t"></validation>
</template>
<script>

import { closeModal } from 'jenesius-vue-modal';
import axios from "axios";
import { getCurrentInstance, ref, reactive, inject } from 'vue';

export default {
   name: 'VuetrefModal',
   components: {

   },
   mixins: [],
   props: {
    title: {
        type: String,
        required: false,
    },
    action: {
        type: String,
        required: true,
    },
    sel_lecseq: {
        type: String,
        required: true,
    },
    sel_refseq: {
        type: String,
        required: true,
    }
   },
   setup(props) {


        const $emitter = inject('$emitter');

        const { proxy } = getCurrentInstance();

        let refInfo = reactive({info: {}});

        // 버튼 초기화
        const modalType = ref(true);
        modalType.value = props.action === 'I' ? true : false;

        // 부모에서 수정버튼을 눌렀을 시 모달창 띄우기
        if(props.sel_refseq) {
            const params = new URLSearchParams();
            params.append('ref_seq', props.sel_refseq);
            axios.post('/tch/refdetail.do', params)
            .then(response => {
                refInfo.info = response.data.result;
            });
        }

        // 수정
        function modRef() {
            saveRef();
        }

        // 삭제
        function delRef() {
            
            proxy.$swal({
                icon: 'warning',
                text: '학습자료를 삭제하시겠습니까?',
                showCancelButton: true,
                reverseButtons: true,
            })
            .then(result => {
                if(result.value) {
                    const params = new URLSearchParams();
                    params.append('bref_seq', props.sel_refseq);
                    params.append('action', 'D');
        
                    axios.post('/tch/refsave.do', params)
                    .then(() => {
                        proxy.$swal({
                            icon: 'success',
                            text: '삭제되었습니다.',
                        });

                        $emitter.emit('result', 'success');

                        close();
                    });
                }
                else {
                    proxy.$swal({
                        icon: 'error',
                        text: '취소되었습니다.',
                    });
                }
            });
        }

        // 제목
        const v_refTitle = ref('');

        // 추가
        const saveRef = function() {

        let checkitem = [
            {itemname: 'ref_title', emptymsg: '제목을 입력하세요!'},
        ];

        if (proxy.$songemptyValidation(checkitem)) {
            const formData = new FormData(document.forms[0]);
            formData.append('action', props.action);
            formData.append('lecseq', props.sel_lecseq);
            formData.append('bref_seq', props.sel_refseq);
    
            axios.post('/tch/refsave.do', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .then((response) => {
                console.log(response);
                proxy.$swal({
                    icon: 'success',
                    text: props.action === 'U' ? '수정 완료 되었습니다.' : '등록 완료 되었습니다.',
                });
                $emitter.emit('result', 'success');
                close();
            })
        }

        }
        

        // 모달 닫기
        function close() {
            
            closeModal();
        }

        return {
            modalType,
            v_refTitle,
            close,
            saveRef,
            refInfo,
            modRef,
            delRef,
        }
   },
   data() {
     return {
       
     }
   },
   computed: {
     
   },
   watch: {
     
   },
   mounted() {
    
   },
   methods: {

   }
};
</script>
<style lang='' scoped>
</style>