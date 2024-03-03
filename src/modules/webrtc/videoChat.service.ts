import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import AgoraRTM from 'agora-rtm-sdk'
import { AgoraChat } from 'agora-rtm-sdk';

  export class VideoChatService {
   constructor( 
    private readonly LoggerService: LoggerService,
    private config: ConfigService
    ){}


    async startVideoChat() {
      
      // get url from dynamic room 
      let queryString=window.location.search
      let urlParams=new URLSearchParams(queryString)
      let roomId=urlParams.get('room')
      if(!roomId){
        window.location.assign('lobby.html');
      }
      let token=null
      // need a uid for each user
      // give us our uid so on each click
      let uid=String(Math.floor(Math.random()*1000000000)) 
      const APP_ID= this.config.get('APP_ID')
      // create server to remoteStream
      const servers={
          iceServers:[{
            urls:['stun:stun1.1.google.com:19302','stun:stun2.1.google.com:19302']
        
          }]
        }
  
   
      try {
        // Get access to the camera and microphone.
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
        localVideo.srcObject = localStream;

        const handleMessageFromPeer = async (message, MemberId) => {
          const peerConnection = new RTCPeerConnection(servers);
          await createPeerConnection(MemberId)
          message = JSON.parse(message.text);
          
          if (message.type === 'offer') {
              createAnswer(MemberId, message.offer);
          } else if (message.type === 'answer') {
              addAnswer(message.answer);
          } else if (message.type === 'candidate') {
              if (peerConnection) {
                  if (peerConnection.remoteDescription) {
                      try {
                          await peerConnection.addIceCandidate(message.candidate);
                      } catch (error) {
                          console.error('Error adding ICE candidate:', error);
                      }
                  } else {
                      console.warn('Remote description is not set yet. ICE candidate will be added later.');
                  }
              }
          }
        }
        

          const handleUserJoined = async (MemberId) => {
          console.log('A new user has joined the channel:', MemberId);
          createOffer(MemberId)

  }
  // when user leaves 
  const handleUserLeft = async (MemberId) => {
           document.getElementById('remoteStream').style.display='none';
           document.getElementById('user-1').classList.remove('smallFrame')
          
          }
          
        // Create an instance of the Agora RTM SDK
         const client = await AgoraRTM.createInstance(APP_ID)
        await client.login({uid, token})
        // create channel
        const channel=client.createStreamChannel(roomId)
          await channel.join()

          channel.on('MemberJoined', handleUserJoined)
          channel.on('MemberLeft', handleUserLeft)
          client.on('MessageFromPeer',handleMessageFromPeer)

          const createPeerConnection=async(MemberId)=>{

              // connecting two peers together and creating an offer   
              const peerConnection = new RTCPeerConnection(servers); 
              const remoteStream = new MediaStream();
              const remoteVideo = document.getElementById('remoteStream') as HTMLVideoElement;
              remoteVideo.srcObject = remoteStream;
              // case in user leaves the channel
              document.getElementById('remoteStream').style.display='block'
              document.getElementById('user-1').classList.add('smallFrame')
        
            
       // event 
       localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });
    // listen two remote peer adds tracks
    peerConnection.ontrack=(event)=>{
      event.streams[0].getTracks().forEach((track)=>{
        remoteStream.addTrack(track)
      })
    
    }
    // once exchange takes place the two peers are now  connected and data 
        // can begin flowing between two peers 
        // need to take this information and send it over to our remote peer 
    // create icecandidate
    peerConnection.onicecandidate=async(event)=>{
      if(event.candidate){
        client.sendMessageToPeer({text:JSON.stringify({'type':'candidate','candidate':event.candidate})},MemberId)
      }
    }
 
          }

        const createOffer=async(MemberId)=>{
          await createPeerConnection(MemberId)
        //  create offer 
        const peerConnection = new RTCPeerConnection(servers);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('offer',offer)
        // Send the offer to the remote peer using a signaling server
        
        client.sendMessageToPeer({text:JSON.stringify({'type':'offer','offer':offer})},MemberId)
            }    
            

        const createAnswer = async (MemberId, offer) => {
          const peerConnection = new RTCPeerConnection(servers);
          await createPeerConnection(MemberId);
        
          try {
            await peerConnection.setRemoteDescription(offer);
            let answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            
            client.sendMessageToPeer({text:JSON.stringify({'type':'answer', 'answer':answer})}, MemberId);
          } catch (error) {
            console.error('Error creating answer:', error);
          }
        }

        const addAnswer=async(answer)=>{
          const peerConnection = new RTCPeerConnection(servers);
         
          if(!peerConnection.currentRemoteDescription){
            peerConnection.setRemoteDescription(answer)
          }
        }
        const leaveChannel=async () =>{
          await channel.leave()
          await client.logout()
          }
          
          window.addEventListener('beforeunload',leaveChannel)
          

      } catch (error) {
        
          this.LoggerService.logError(error);
          throw new InternalServerErrorException('Error creating user');
        }
    }

    
  }




  












