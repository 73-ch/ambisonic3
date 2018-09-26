require 'socket'
require "json"
require 'eventmachine'
require 'active_support/time'

class Sender < EM::Connection
  @@wait = {}

  def get_timestamp(time)
    (time.to_f - time.beginning_of_day.to_f).to_s.match(/.*\./).to_s + time.nsec.to_s
  end

  def post_init
    EM::defer do
      count = 0
      loop do
        time = Time.current
        data = {}
        data["id"] = count
        data["t1"] = get_timestamp(time)

        send_datagram(data.to_json, 'localhost', 10000)
        count+=1
        sleep 0.001
      end

    end
  end

  def receive_data(row_data)
    receive_time = Time.current
    data = JSON.parse(row_data)

    if data["subsequence"]
      @@wait[data["id"]]["t3"] = data["t3"]

      result = {}

      result["all"] = @@wait[data["id"]]["t4"].to_f * 1000.0 - @@wait[data["id"]]["t1"].to_f * 1000.0
      result["server_process"] = @@wait[data["id"]]["t3"].to_f * 1000.0 - @@wait[data["id"]]["t2"].to_f * 1000.0

      result["network_latency"] = (result["all"]-result["server_process"])/2
      result["local_t"] = @@wait[data["id"]]["t4"].to_f * 1000.0
      result["server_t"] = @@wait[data["id"]]["t3"].to_f * 1000.0 + result["network_latency"]
      result["tolerance"] = result["server_t"] - result["local_t"]

      puts result

    else
      data["t4"] = self.get_timestamp(receive_time)
      @@wait[data["id"]] = data
    end
  end
end


EM::run do
  EM::open_datagram_socket('localhost', 3383, Sender)
end