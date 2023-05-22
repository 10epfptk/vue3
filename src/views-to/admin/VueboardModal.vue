<template>
  <div
    class="layerPop layerType2"
    style="display: table; width: 800px; border: 2px solid #fff"
  >
    <!--전체 div Start -->
    <dl>
      <dt>
        <strong
          ><span id="popupTitle">{{ popupTitle }}</span></strong
        >
      </dt>
      <dd class="content">
        <!-- content Start -->
        <!-- s : 여기에 내용입력 -->
        <form id="myForm">
          <table class="row" style="width: 760px">
            <tbody>
              <tr>
                <th scope="row" style="width: 100px">
                  글제목 <span class="font_red">*</span>
                </th>
                <td style="width: 400px">
                  <span
                    id="span_title"
                    v-if="vshow_span_title"
                    v-text="board_title"
                  ></span>
                  <input
                    type="text"
                    name="board_title"
                    id="board_title"
                    ref="board_title"
                    class="inputTxt p100"
                    v-model="board_title"
                    v-show="vshow_board_title"
                    @mouseover="doMouseOver($event)"
                    style="border: 1px solid #777777"
                  />
                </td>
                <th scope="row" style="width: 100px">
                  글쓴이 <span class="font_red">*</span>
                </th>
                <td style="width: 160px">
                  <span id="span_userNm" v-text="writer"></span>
                </td>
              </tr>
              <tr>
                <th scope="row">등록일</th>
                <td colspan="3">
                  <span id="span_regdate" v-text="span_regdate"></span>
                </td>
              </tr>
              <tr id="tr_content">
                <th scope="row">글내용<span class="font_red">*</span></th>
                <td
                  colspan="3"
                  style="
                    display: table-cell;
                    vertical-align: top;
                    height: 200px;
                  "
                >
                  <span
                    id="span_cont"
                    v-html="span_cont"
                    v-if="vshow_span_cont"
                  ></span>
                  <!--  본문 글 내용 삽입 구간 -->
                  <textarea
                    name="board_cont"
                    id="board_cont"
                    ref="board_cont"
                    class="inputTxt p100"
                    v-model="board_cont"
                    v-show="vshow_board_cont"
                    @mouseover="doMouseOver($event)"
                  ></textarea>
                </td>
              </tr>
              <tr id="tr_file" v-show="tr_file">
                <th scope="row">파일</th>
                <td colspan="2">
                  <span v-show="span_selfile"
                    ><input
                      type="file"
                      class="inputTxt p100"
                      name="selfile"
                      id="selfile"
                      @change="selfileChange"
                  /></span>
                  <span id="spanFile" v-if="showSpanfile">
                    <a
                      href=""
                      id="downLoadFile"
                      class="downLoadFile"
                      title="file download"
                      style="text-decoration: underline"
                      @click.prevent="fn_download()"
                      >{{ file_name }}</a
                    >
                  </span>
                  <span id="spanFile" v-if="noSpanfile">첨부 없음</span>
                </td>
                <td colspan="2">
                  <div id="fileinfo" :style="fileWidth" v-html="fileinfo"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        <div
          class="btn_areaC mt30"
          style="
            width: 275px;
            display: flex;
            justify-content: center;
            margin: auto;
          "
        >
          <a
            href=""
            class="btnType blue"
            id="btnSaveModeboard"
            @click.prevent="fn_editModeChange()"
            name="btn"
            v-if="btnSaveModeboard"
            ><span>수정</span></a
          >
          <a
            href=""
            class="btnType blue"
            id="btnSaveboard"
            name="btn"
            @click.prevent="fn_saveboard()"
            v-if="btnSaveboard"
            ><span>저장</span></a
          >
          <a
            href=""
            class="btnType gray"
            id="btnDeleteboard"
            name="btn"
            @click.prevent="fn_Deleteboard()"
            v-if="btnDeleteboard"
            ><span>삭제</span></a
          >
          <a
            href=""
            class="btnType gray"
            id="btnCloseboard"
            name="btn"
            @click.prevent="fn_closeboard()"
            ><span>닫기</span></a
          >
        </div>

        <br />

        <!--</div>-->

        <!--  QnA 댓글 Start -->

        <div class="" id="qnaReplyDivSpace" v-show="qnaReplyDivSpace">
          <!-- div:qnaReplyDivSpace Start -->
          <!-- 답변 입력 창  Start-->
          <div
            class=""
            id="divQnareplyInput"
            style="width: 100%; display: table"
            v-show="divQnareplyInput"
          >
            <!-- div -->
            <table style="width: 100%; background-color: inherit">
              <tr>
                <th colspan="3" style="text-align: center">
                  <a
                    href=""
                    class="btnType3 color1"
                    id="btnReplyboard"
                    @click.prevent="fn_ReplyInput()"
                    name="btn"
                    ><span>답글 남기기</span></a
                  >
                </th>
              </tr>
              <tr>
                <td colspan="3">
                  <div
                    id="spanReplyInput"
                    v-show="spanReplyInput"
                    style="width: 100%; display: table"
                  >
                    <!--  span or div -->
                    <table class="row" style="width: 100%; display: table-cell">
                      <tbody>
                        <tr>
                          <th scope="row" style="width: 130px">
                            작성자 : {{ loginName }}
                          </th>
                          <td style="width: 60%">
                            <textarea
                              name="qr_cont"
                              id="qr_cont"
                              ref="qr_cont"
                              maxlength="250"
                              v-model="qr_cont"
                              @mouseover="doMouseOver($event)"
                            ></textarea>
                          </td>
                          <td style="width: 180px; text-align: center">
                            <div
                              style="
                                width: 143px;
                                display: flex;
                                justify-content: space-between;
                              "
                            >
                              <a
                                href=""
                                @click.prevent="btnSaveReply"
                                class="btnType2 color1"
                                id="btnSaveReply"
                                name="btn"
                                ><span>저장</span></a
                              >
                              <a
                                href=""
                                @click.prevent="btnCancelReply"
                                class="btnType2 color4"
                                id="btnCancelReply"
                                name="btn"
                                ><span>취소</span></a
                              >
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <!-- 답변 입력 참  End-->
          <div style="height: 10px"></div>

          <!-- 댓글 목록 보여주기			 -->
          <!-- div:replyList Start -->
          <div id="replyList" class="" style="width: 100%; display: table">
            <table class="col" id="table_rowlist_get">
              <caption>
                caption
              </caption>
              <colgroup>
                <col width="15%" />
                <col width="70%" />
                <col width="15%" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">작성자</th>
                  <th scope="col">답 글 내 용</th>
                  <th scope="col">등록일</th>
                </tr>
              </thead>

              <!-- 답변 리스트  Start -->
              <template v-if="reply_totalCnt === 0">
                <tbody>
                  <tr>
                    <td colspan="3">아직 답글이 없어요~ ^^</td>
                  </tr>
                </tbody>
              </template>
              <template v-else>
                <tbody
                  v-for="(list, index) in replylist"
                  :id="list.qr_seq"
                  :key="index"
                >
                  <tr height="10px">
                    <td style="text-align: left">
                      <span id="spanUserName">@ {{ list.loginName }}</span>
                    </td>
                    <td style="text-align: left; space: 0pt; padding: 0pt">
                      <table style="width: 100%; background-color: inherit">
                        <!--부모 칼라 속성 상속받음 background-color:inherit -->

                        <colgroup>
                          <col width="77%" />
                          <col width="23%" />
                        </colgroup>
                        <tr style="height: 15px; background-color: #ffffff">
                          <td style="border: 0pt; width: 76%; text-align: left">
                            <span id="qrCont_text" v-if="vshowQrCont[index]">{{
                              list.qr_cont
                            }}</span>
                            <!--  내용 text 부분  -->
                            <span
                              id="span_qr_newCont"
                              v-show="span_qr_newCont[index]"
                            >
                              <textarea
                                name="qr_newCont"
                                id="qr_newCont"
                                class="qr_newCont"
                                v-model="qr_newCont"
                              ></textarea>
                            </span>
                            <!--  v-show="vshow_qr_newCont" -->
                          </td>
                          <template
                            v-if="
                              this.user_type === 'A' ||
                              list.loginID === this.loginID
                            "
                          >
                            <!-- 관리자와 글쓴이만 수정/삭제 가능 -->

                            <td style="border: 0pt; text-align: right">
                              <span
                                style="
                                  width: 100%;
                                  text-align: right;
                                  color: red;
                                  font-size: 9px;
                                "
                              >
                                [
                                <span
                                  id="spanReplySaveCancel"
                                  v-if="spanReplySaveCancel[index]"
                                >
                                  <a
                                    href=""
                                    name="btn"
                                    @click.prevent="btnReplySave($event)"
                                    :key="list.qr_seq"
                                    :id="list.qr_seq"
                                    >저장</a
                                  >
                                  |
                                  <a
                                    href=""
                                    id="btnReplyCancel"
                                    name="btn"
                                    @click.prevent="btnReplyCancel(index)"
                                    >취소</a
                                  >
                                  |
                                </span>

                                <span
                                  id="spanReplyUpdate"
                                  v-if="spanReplyUpdate[index]"
                                >
                                  <a
                                    href=""
                                    @click.prevent="
                                      btnReplyEditMode(
                                        index,
                                        $event,
                                        list.qr_cont
                                      )
                                    "
                                    name="btn"
                                    :key="index"
                                    :id="list.qr_seq"
                                    >수정</a
                                  >
                                  |
                                </span>
                                <span id="spanQrContent2">
                                  <a
                                    href=""
                                    @click.prevent="fn_btnDeleteReply($event)"
                                    :id="list.qr_seq"
                                    >삭제</a
                                  >
                                  ]
                                </span>
                              </span>
                            </td>
                          </template>
                        </tr>
                      </table>
                      <!--  -->
                    </td>
                    <td style="text-align: center">{{ list.qr_regdate }}</td>
                  </tr>
                </tbody>
              </template>
              <!-- 답변 리스트  End -->
            </table>
            <!-- 답변 페이징 구간 Start -->

            <paginate
              v-if="reply_totalCnt > 0"
              class="justify-content-center"
              v-model="qr_cpage"
              :page-count="qr_pagenumsize"
              :page-range="5"
              :margin-pages="0"
              :click-handler="replylistsearch"
              :prev-text="'Prev'"
              :next-text="'Next'"
              :container-class="'pagination'"
              :page-class="'page-item'"
            >
            </paginate>

            <!-- 답변 페이징 구간 End -->
          </div>
          <!-- div:replyList End -->

          <!-- 댓글 목록 보여주기 End -->
        </div>
        <!-- div:qnaReplyDivSpace End -->
        <!--  QnA 댓글 End ---------------->
        <!-- content End -->
      </dd>
    </dl>
  </div>
  <!--전체 div End -->
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';
import Paginate from 'vuejs-paginate-next';
//import dayjs from 'dayjs';
//import VueReply from './VueReplyModal.vue';
export default {
  props: {
    popupTitleName: String, //모달창 상단 제목
    board_seq: Number,
    action: String,
    loginName: String,
    loginID: String, //접속한 아이디
    board_type: String,
    user_type: String,
    page: {
      type: Function,
      default: () => {},
    }, //페이지 계산 function
  },
  data: function () {
    return {
      maction: '', //모달창 action
      board_title: '',
      board_cont: '',
      file_seq: 0, //파일seq 모달창 열때마다 초기화
      file_nadd: '', //파일 논리경로
      file_madd: '', //파일 물리경로
      file_name: '', //파일명
      fileinfo: '', //첨부파일 있는 경우 d.i.v에 보여주기
      selfile: '', //등록할 첨부파일
      writer: '', //글쓴이 이름
      popupTitle: '', //모달창 상단 타이틀
      vshow_span_title: true, //글읽기모드 board_title 영역
      vshow_span_cont: true, //글읽기모드 board_cont 영역
      tr_file: true, //파일 첨부 tr 보여주기(공지사항)/감추기(QnA)
      fileWidth: '', //파일 스타일
      span_selfile: false, //input 첨부파일 보여주기(공지사항)/감추기(QnA)
      showSpanfile: false, //첨부 있음
      noSpanfile: false, //첨부 없음
      spanFile: '',
      span_regdate: '',
      span_cont: '',

      btnSaveModeboard: false, //수정모드로 전환 버튼
      btnSaveboard: false, //수정글 저장 버튼
      btnDeleteboard: false, //삭제 버튼

      vshow_board_title: true, //글 제목 입력창(글등록, 수정시)
      vshow_board_cont: true, //글 내용 입력창(글등록, 수정시)

      /** 답변 */
      qnaReplyDivSpace: false, //답글 영역 보여주기(QnA)/감추기(공지사항)
      divQnareplyInput: true, //답글 입력창 보여주기(QnA)/감추기(공지사항)

      qr_action: 'R',
      replylist: [], //답변 목록
      reply_totalCnt: 0,
      qr_cpage: 1,
      pageSizeReply: 5,
      blockSizeReply: 10,
      qr_pagenumsize: 0,
      qr_cont: '',
      qr_newCont: '',
      newTextarea: '',
      replyBtnArea: '',
      qrCont_text: '', //답변 text부분
      spanReplyInput: false, //답변 입력 창

      span_qr_newCont: [], //답변 글 수정 textarea 영역
      spanReplyUpdate: [], //답글 수정 버튼 영역
      spanReplySaveCancel: [], //답글 수정 취소 버튼
      vshowQrCont: [], //답글 text v-show

      qrIndex_Backup: '', //답글 index 백업 : 수정버튼 후 재 수정버튼 클릭시 변경하기 위함
    };
  },
  computed: {},
  components: {
    paginate: Paginate,
    //'reply-component': VueReply,
  },
  mounted() {
    console.log('Hi~ modal Start');
    console.log('this.action : ' + this.action + ' / ' + this.popupTitleName);
    this.maction = this.action;
    this.popupTitle = this.popupTitleName;

    if (this.board_type !== 'C') {
      this.tr_file = true;
      this.span_selfile = true; //input 파일첨부 보이기
    } else {
      this.tr_file = false; //this.board_type =='C'일때 첨부 tr 안보이게 하기
    }

    if (this.maction == 'I') {
      //글 등록 모드 인 경우
      const dayjs = require('dayjs');
      const d = dayjs();
      this.span_regdate = d.format('YYYY년 MM월DD일');

      this.writer = this.loginName;
      this.vshow_span_title = false;
      this.vshow_span_cont = false;
      this.$refs.board_title.focus();
      //if (this.user_type == 'A') {
      this.fn_btnHide2(); //글 저장 버튼 보이기
      //}
    } else if (this.maction == 'R') {
      //글 읽기 모드
      this.fn_initForm();
    } else {
      // maction = I or R이 아닌 경로로 들어온 경우
      console.log(' ETC : 경로 Error');

      if (this.user_type == 'A') {
        this.fn_btnShow();
      }
      // this.$swal(' 올바른 경로가 아닙니다. 확인! ');
    } //end if

    console.log('modal action : ' + this.maction);
    console.log('modal board_seq : ' + this.board_seq);
    console.log('writerName : ' + this.loginName);
    console.log('modal board_type : ' + this.board_type);
    console.log('tr_file : ' + this.tr_file);
  },

  methods: {
    fn_btnHide: function () {
      this.btnSaveboard = false; //글 저장모드
      this.btnDeleteboard = false; //글 삭제모드
      this.btnSaveModeboard = false; //글 수정모드
    },
    fn_btnHide2: function () {
      this.btnSaveModeboard = false; //글 수정모드 숨기기
      this.btnDeleteboard = false; //글 삭제버튼 숨기기
      this.btnSaveboard = true; //글 저장버튼 보이기
    },

    fn_btnShow: function () {
      //글 수정모드
      this.btnSaveModeboard = true; //글 수정모드 버튼 보이기
      this.btnDeleteboard = true; //글 삭제 버튼 보이기
      this.btnSaveboard = false; //글 저장 버튼 숨기기
    },
    fn_selectboard: function () {
      let vm = this;
      let param = new URLSearchParams();
      param.append('board_seq', vm.board_seq);

      this.axios
        .post('/admin/boardSelect.do', param)
        .then(function (res) {
          console.log(res);
          let dataInfo = res.data.boardinfo;
          vm.span_regdate = dataInfo.board_regdate;
          vm.board_title = dataInfo.board_title;
          vm.board_cont = dataInfo.board_cont;
          vm.file_seq = dataInfo.file_seq;
          vm.file_madd = dataInfo.file_madd;
          vm.file_nadd = dataInfo.file_nadd;
          vm.file_name = dataInfo.file_name;
          vm.writer = dataInfo.loginName;

          // 게시판 글 수정/삭제 권한 : 관리자 및 글쓴이 수정 가능.
          if (vm.user_type == 'A' || vm.loginID == dataInfo.loginID) {
            //관리자 거나, 본인글인 경우 수정/삭제 가능
            vm.fn_btnShow();
          } else {
            // 글 수정/삭제 권한자가 아닌 경우 버튼 숨김
            vm.fn_btnHide();
          }

          //글내용 <br>처리
          if (vm.board_cont == null) {
            vm.span_cont = '';
          } else {
            vm.span_cont = vm.board_cont.replaceAll(/(\n|\r\n)/g, '<br>');
          }
          console.log('board_title : ' + vm.board_title);
          console.log('board_cont : ' + vm.board_cont);

          // QnA게시판 권한 : 공지게시판 및 승인안된 강사 댓글 숨기기~
          if (vm.board_type == 'C') {
            vm.qr_action = 'R';
            vm.qnaReplyDivSpace = true; //답글 리스트 영역 보여주기

            if (
              vm.user_type == 'C' ||
              (vm.user_type == 'D' && vm.loginID != dataInfo.loginID)
            ) {
              // QnA게시판 승인안된 강사 댓글 금지~
              //승인안된 강사와 글쓴이 이외의 학생은 댓글리스트만 보여준다. 댓글리스트까지 안보여줄 경우
              //==> this.qnaReplyDivSpace = false;

              vm.divQnareplyInput = false;
            }

            vm.replylistsearch(); //
          } else {
            //board_type == C 인 경우  End

            // 첨부 파일이 있는 경우 (QnQ게시판이 아닌 경우) Start-------------------------------//
            if (vm.board_type != 'C' && vm.file_name != null) {
              console.log('file : ' + vm.file_seq);
              console.log('파일 물리 경로 file_madd : ' + vm.file_madd);

              let aFile =
                "<a href='' id='downLoadFile' class='downLoadFile' title='file download' style='text-decoration:underline'>" +
                vm.file_name +
                '</a>';

              vm.spanFile = aFile;
              vm.showSpanfile = true;

              // 첨부 파일이 있는 경우 (공지 게시판)-------------------------------//
              if (vm.file_name != null) {
                let f_length = vm.file_name.length;
                let f_extension_loc = vm.file_name.lastIndexOf('.'); //파일명에 확장자구분 '.' 이외의 '.'들이 들어간 경우
                let arr = vm.file_name
                  .substring(f_extension_loc + 1)
                  .toLowerCase();
                console.log('file_name : ' + vm.file_name);
                console.log('file_length : ' + f_length);
                console.log('file extension location : ' + f_extension_loc);
                console.log('file extension : ' + arr);
                if (
                  arr == 'jpg' ||
                  arr == 'png' ||
                  arr == 'jpeg' ||
                  arr == 'gif'
                ) {
                  let previewhtml =
                    "<img src='" +
                    vm.file_nadd +
                    "' style='width: 100px; height: 100px;text-align:center' />";

                  vm.fileinfo = previewhtml;
                  vm.fileWidth = 'text-align:center';
                } else {
                  vm.fileinfo = '파일명 : ' + vm.file_name;
                  vm.fileWidth = 'text-align:left';
                }
              } //end if
              //----------------------------------------------------//
            } else {
              vm.spanFile = '첨부 없음';
              vm.noSpanfile = true; //첨부 없음
            }

            //----- 첨부 파일이 있는 경우 (QnQ게시판이 아닌 경우) End
          }
        })
        .catch(function (error) {
          this.$swal('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    fn_initForm: function () {
      let vm = this;

      /** 초기화 설정 Start*/
      vm.vshow_board_title = false; //초기 설정 input  입력창
      vm.vshow_board_cont = false; //초기 설정 textarea 입력창
      vm.vshow_span_title = true; //글 읽기 모드에서 보이기
      vm.vshow_span_cont = true; //글 읽기 모드에서 보이기

      vm.span_selfile = false; // 첨부파일 선택 감추기
      vm.newTextarea = '';
      vm.replyBtnArea = '';
      /** 초기화 설정 End */

      vm.fn_selectboard();
    },
    fn_saveboard: function () {
      console.log('fn_saveboard Start');
      let vm = this;
      let frm = document.getElementById('myForm');
      frm.enctype = 'multipart/form-data';

      let checkitem = [
        {
          itemname: this.board_title,
          emptymsg: '제목을 입력해주세요',
        },
        {
          itemname: this.board_cont,
          emptymsg: '내용을 입력해주세요',
        },
      ];
      let result = this.$emptyValidation(checkitem);
      console.log('result : ' + result);
      if (!result) {
        //false일때
        console.log(' validation check false');
        return;
      } else {
        //true일때
        console.log(' validation check true');

        let dataWithFile = new FormData(frm);
        dataWithFile.append('action', vm.maction);
        dataWithFile.append('loginID', vm.loginID);
        dataWithFile.append('board_type', vm.board_type);
        dataWithFile.append('board_seq', vm.board_seq);
        dataWithFile.append('file_seq', vm.file_seq); //파일 번호
        dataWithFile.append('file_madd', vm.file_madd); //기존 파일이 존재하고, 새로 파일을 업로드 할경우 기존 파일 삭제를 위한 물리경로

        vm.axios
          .post('/admin/boardSave.do', dataWithFile)
          .then(function (res) {
            console.log(res);
          })
          .catch(function (error) {
            this.$swal('에러! API 요청에 오류가 있습니다. ' + error);
          });

        let infoText = '';
        if (vm.maction == 'I') {
          infoText = ' 등록 되었습니다. ';
        } else if (vm.maction == 'U') {
          infoText = ' 수정 되었습니다. ';
        } else if (vm.maction == 'D') {
          infoText = ' 삭제 되었습니다. ';
        } else {
          infoText = ' 작업 오류 입니다. ';
        }
        //this.swal(infoText);
        this.$swal(infoText);
        vm.fn_closeboard();
      }
    },

    selfileChange: function (event) {
      let ch_file = event.target;
      if (this.maction == 'I') {
        this.file_seq = -1;
      }
      if (this.selfile != null) {
        let filearr = this.selfile.split('.');

        let file = ch_file.files[0];
        let imgpath = window.URL.createObjectURL(file);
        let previewhtml = '';
        console.log('imgpath : ' + imgpath);

        let arr = filearr[1].toLowerCase();
        if (arr == 'jpg' || arr == 'png' || arr == 'jpeg' || arr == 'gif') {
          previewhtml =
            "<img src='" +
            imgpath +
            "' id='imgFile' style='width: 100px; height: 100px;' />";
        }
        this.fileinfo = previewhtml;
        this.file_seq = -1; // 새글 작성시 -1로 변경	//controller에서 -1은 새글에 첨부 있음으로 인식
      }
      console.log('this.file_seq : ' + this.file_seq);
      console.log('Change selfile : ' + this.selfile);
    },

    fn_editModeChange: function () {
      console.log('SaveMode : Y ');
      let vm = this;
      vm.maction = 'U';
      vm.popupTitle = '글 수 정';
      vm.spanFile = '';
      vm.btnSaveboard = true;
      vm.btnSaveModeboard = false;
      vm.vshow_span_title = false; //수정시  안보이기
      vm.vshow_span_cont = false; //수정시  안보이기
      vm.vshow_board_title = true; //수정창 설정  true
      vm.vshow_board_cont = true; //수정창 설정  true

      if (vm.board_type !== 'C') {
        vm.span_selfile = true; //파일첨부 보이기
      }
      if (vm.file_name == null || vm.file_name == '') {
        vm.spanFile = '';
      }
    },
    fn_Deleteboard: function () {
      //this.maction='D';
      let vm = this;
      let message = "'삭제 하시겠습니까?'";
      let ref = function (result) {
        console.log('Delete confirm result: ' + result);
        vm.maction = 'D';
        if (result) {
          vm.fn_saveboard();
        }
      };
      this.confirm(message, ref);
    },
    replylistsearch: function () {
      let vm = this;
      console.log('replylistsearch 실행');
      console.log('실행시 qr_action  : ' + vm.qr_action); //답글용 action
      this.qr_action = 'R';
      console.log('실행후 qr_action  : ' + vm.qr_action); //답글용 action
      let param = new URLSearchParams();
      param.append('pagenum', vm.qr_cpage);
      param.append('pageSize', vm.pageSizeReply);
      param.append('board_seq', vm.board_seq);

      console.log('param : ' + param);

      this.axios
        .post('/admin/vuereplyList.do', param)
        .then(function (res) {
          console.log(res);
          vm.reply_totalCnt = res.data.reply_totalCnt;
          vm.replylist = res.data.replylist;
          vm.qr_pagenumsize = vm.page(vm.reply_totalCnt, vm.pageSizeReply); //부모로 부터 props로 받은 page function 사용
          vm.replylist.forEach(function (value, index) {
            vm.vshowQrCont[index] = true; //답변 text 부분 보여주기
            vm.span_qr_newCont[index] = false; //답변 textarea 부분 감추기
            vm.spanReplyUpdate[index] = true; //수정버튼
            vm.spanReplySaveCancel[index] = false; //저장, 취소버튼
            console.log(
              'vm.vshowQrCont[' + index + '] : ' + vm.vshowQrCont[index]
            );
          });
          console.log('replyTotalcnt : ' + vm.reply_totalCnt);
        })
        .catch(function (error) {
          this.$swal('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    fn_ReplyInput: function () {
      if (this.spanReplyInput == false) {
        this.spanReplyInput = true;
      } else {
        this.spanReplyInput = false;
      }
    },
    btnReplySave: function (event) {
      this.qr_seq = event.currentTarget.id;
      this.qr_action = 'U';
      this.fn_saveReply();
    },
    btnCancelReply: function () {
      this.spanReplyInput = false;
    },
    btnReplyEditMode: function (index, event, qr_cont) {
      const qr_seq = event.currentTarget.id;

      this.qr_newCont = qr_cont;
      this.$forceUpdate(); //배열 업데이트가 잘 안되는 경우 설정함!
      this.fn_ReplyEditMode(qr_seq, index);
    },
    btnSaveReply: function () {
      this.qr_action = 'I';
      // validation 체크 설정 하기
      let checkitem = [
        {
          itemname: this.qr_cont,
          emptymsg: '답변 내용을 입력해주세요',
        },
      ];

      let result = this.$emptyValidation(checkitem);
      console.log('result : ' + result);
      if (!result) {
        //false일때
        console.log(' validation check false');
      } else {
        //true일때
        console.log(' validation check true');

        this.fn_saveReply();
        //답변글 입력후 답변창 초기화 및 입력창 숨기기
        this.qr_cont = '';
        this.spanReplyInput = false;
      }
    },
    btnReplyCancel: function (index) {
      this.qr_action = 'R';
      this.$forceUpdate(); //배열 업데이트가 잘 안되는 경우 설정함!
      this.fn_ReplyCancel(index);
    },
    fn_btnDeleteReply: function (event) {
      let vm = this;
      vm.qr_seq = event.currentTarget.id;
      vm.qr_action = 'D';

      console.log('delete qr_seq : ', this.qr_seq);
      console.log('qr_action 삭제 value : ', this.qr_action);

      let message = "'답변을 삭제 하시겠습니까?'";
      let ref = function (result) {
        console.log('Reply Delete confirm result: ' + result);

        if (result) {
          vm.fn_saveReply();
        }
      };
      vm.confirm(message, ref);
    },
    fn_saveReply: function () {
      console.log('fn_saveReply : Y');
      console.log('this.qr_newCont : ' + this.qr_newCont);
      let vm = this;
      let qrContent;
      if (vm.qr_action == 'I') {
        qrContent = vm.qr_cont;
      } else {
        qrContent = vm.qr_newCont;
      }
      let param = new URLSearchParams();
      param.append('qr_seq', vm.qr_seq);
      param.append('qr_cont', qrContent);
      param.append('qr_action', vm.qr_action);
      param.append('board_seq', vm.board_seq); //글 등록의 경우
      param.append('loginID', vm.loginID); //글 등록의 경우
      console.log('param : ' + param);

      vm.axios
        .post('/admin/replySave.do', param)
        .then(function (res) {
          console.log(res);
          if (res.status == 200) {
            let infoText = '';
            if (vm.qr_action == 'I') {
              infoText = ' 등록 되었습니다. ';
            } else if (vm.qr_action == 'U') {
              infoText = ' 수정 되었습니다. ';
            } else if (vm.qr_action == 'D') {
              infoText = ' 삭제 되었습니다. ';
            } else {
              infoText = ' 작업 오류 입니다. '; //check
            }

            vm.$swal(infoText);
            vm.replylistsearch(vm.qr_cpage);
          }
        })
        .catch(function (error) {
          this.$swal('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    fn_ReplyEditMode: function (qr_seq, index) {
      console.log('fn_ReplyEditMode qr_action : ' + this.qr_action);
      console.log('qr_seq : ' + qr_seq);
      console.log('index : ' + index);

      if (this.qr_action != 'E') {
        //if Start~ 답글(reply): 수정모드가 아닐때 조건문 [ qr_action = E는 수정모드 ]

        this.qr_seq = qr_seq;
        this.qr_action = 'E'; //수정모드
        //this.qrIndex_Backup = index; //수정버튼을 다시 누룰때를 위해 기존 index backup

        //this.fn_ReplyEditIndex(index);
      } else {
        //qr_action = E 일때 (수정을 중복해서 클릭한 경우) 기존인덱스 숨김, 새로운 인덱스로 보여주기

        this.fn_ReplyCancel(this.qrIndex_Backup); //Reset
      } //end if
      this.fn_ReplyEditIndex(index); //Edit
      this.qrIndex_Backup = index; //수정버튼을 다시 누룰때를 위해 기존 index backup
      console.log('Backup index : ' + this.qrIndex_Backup);
      console.log(
        'this.span_qr_newCont[' + index + '] : ' + this.span_qr_newCont[index]
      );
    },
    /**답글 배열 수정모드 true, false */
    fn_ReplyEditIndex: function (index) {
      this.$forceUpdate(); //배열 v-show 갱신  메소드
      this.span_qr_newCont[index] = true; //답변 textarea
      this.spanReplySaveCancel[index] = true; // 저장, 취소 버튼 보이기
      this.spanReplyUpdate[index] = false; // 수정버튼  숨기기
      this.vshowQrCont[index] = false; // 답변  text 숨기기
    },
    /**답글 수정모드 취소(reset) true, false */
    fn_ReplyCancel: function (index) {
      this.$forceUpdate(); //배열 v-show 갱신  메소드
      this.spanReplySaveCancel[index] = false; // 저장, 취소 버튼 보이기
      this.spanReplyUpdate[index] = true;
      this.vshowQrCont[index] = true; // 답변  text 부분 적용 될까??
      this.span_qr_newCont[index] = false; //답변 textarea
    },
    confirm: function (title, result) {
      // 내용, 리턴받을 결과function
      console.log('title : ' + title);
      this.$swal({
        title: title,
        //text : msg,
        type: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonClass: 'btn-danger',

        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonColor: '#ff8633', // confirm 버튼 색 지정
        cancelButtonColor: '#6e7881', // cancel 버튼 색 지정
        color: '#ffffff', // 글자 색 지정
        background: '#2c2a35', // Confirm창 배경 색 지정

        closeOnConfirm: false, //false: 처리 완료창 보여주기,  true:처리 완료창 안보여줌
        closeOnCancel: false,
      }).then((re) => {
        console.log('re.isConfirmed result : ' + re.isConfirmed);
        if (re.isConfirmed) {
          this.$swal('', '삭제 되었습니다.', 'success');
        } else {
          this.$swal('', '취소 되었습니다.', '');
        }
        result(re.isConfirmed);
        return result;
      });
    },
    fn_download: function () {
      let vm = this;

      //let params = new URLSearchParams();
      let frm = document.getElementById('myForm');
      frm.enctype = 'multipart/form-data';

      let params = new FormData(frm);
      params.append('file_madd', vm.file_madd);
      params.append('file_name', vm.file_name);

      this.axios
        .post('/admin/boardDownload.do', params)
        .then((res) => {
          console.log(res);
          const FILE = window.URL.createObjectURL(new Blob([res.data]));
          console.log('FILE : ' + FILE);
          const docUrl = document.createElement('a');
          docUrl.style.display = 'none';
          docUrl.href = FILE;
          docUrl.setAttribute('download', vm.file_name);
          document.body.appendChild(docUrl);
          docUrl.click();
          document.body.removeChild(docUrl);
          window.URL.revokeObjectURL(docUrl);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    doMouseOver: function (event) {
      //포커스
      event.target.focus();
    },
    fn_closeboard: function () {
      closeModal(this);
    },
  },
};
</script>
<style>
a:hover {
  text-decoration: none;
}
</style>
