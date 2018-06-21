class SyncChannel < ApplicationCable::Channel
  def subscribed
    # cue for everyone
    stream_from "cues"
    if admin_check
      # for admin
      stream_from "devices"
    else
      # for time_sync with each device
      stream_from "time_sync:#{user_params}"
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def say_hello(rcv)
    logger.info rcv["content"]
    ActionCable.server.broadcast "cues", message: "1 hello!!"
    ActionCable.server.broadcast "time_sync:#{user_params}", message: "2 hello!!"
    ActionCable.server.broadcast "devices", message: "3 hello!!"
    stream_for @test
  end

  # for debug
  def send_audio_node_json(data)
    if admin_check
      ActionCable.server.broadcast "cues", message: "audio_nodes", json: data["json"]
    end
  end


  private
  def admin_check
    user_params == "admin"
  end
end
