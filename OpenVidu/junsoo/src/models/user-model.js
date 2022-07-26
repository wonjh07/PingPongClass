// UserModel: 각 유저마다 어떤 상태인지를 확인하기 위한 유저 기본 클래스(모델)
class UserModel {
  connectionId;
  audioActive;
  videoActive;
  screenShareActive;
  nickname;
  streamManager;
  type; // 'remote' | 'local'
  // 추가 항목들
  picked;
  point;
  emoji;
  frameColor;

  constructor() {
    this.connectionId = "";
    this.audioActive = true;
    this.videoActive = true;
    this.screenShareActive = false;
    this.nickname = "";
    this.streamManager = null;
    this.type = "local";
    this.picked = false;
    this.point = 0;
    this.emoji = "";
    this.frameColor = "";
  }

  isAudioActive() {
    return this.audioActive;
  }

  isVideoActive() {
    return this.videoActive;
  }

  isScreenShareActive() {
    return this.screenShareActive;
  }

  getPoint() {
    return this.point;
  }
  getEmoji() {
    return this.emoji;
  }
  getFrameColor() {
    return this.frameColor;
  }

  getConnectionId() {
    return this.connectionId;
  }

  getNickname() {
    return this.nickname;
  }

  getStreamManager() {
    return this.streamManager;
  }

  getIsPicked() {
    return this.isPicked;
  }

  isLocal() {
    return this.type === "local";
  }
  isRemote() {
    return !this.isLocal();
  }
  setAudioActive(isAudioActive) {
    this.audioActive = isAudioActive;
  }
  setVideoActive(isVideoActive) {
    this.videoActive = isVideoActive;
  }
  setScreenShareActive(isScreenShareActive) {
    this.screenShareActive = isScreenShareActive;
  }
  setStreamManager(streamManager) {
    this.streamManager = streamManager;
  }

  setConnectionId(conecctionId) {
    this.connectionId = conecctionId;
  }
  setNickname(nickname) {
    this.nickname = nickname;
  }

  setIsPicked(isPicked) {
    this.isPicked = isPicked;
  }
  setPoint(point) {
    this.point = point;
  }
  setEmoji(emoji) {
    this.emoji = emoji;
  }
  setFrameColor(frameColor) {
    this.frameColor = frameColor;
  }

  setType(type) {
    if ((type === "local") | (type === "remote")) {
      this.type = type;
    }
  }
}

export default UserModel;
