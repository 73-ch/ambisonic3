require 'socket'
require 'json'
require 'eventmachine'
require 'active_support/time'

class UDPServer < EM::Connection
  @@port = 10000
  @@host = 'localhost'

  def get_timestamp(time)
    (time.to_f - time.beginning_of_day.to_f).to_s.match(/.*\./).to_s + time.nsec.to_s
  end

  def receive_data row_data
    start_time = Time.current
    begin
      data = JSON.parse(row_data)

      data["t2"] = self.get_timestamp(start_time)

      port, host = Socket.unpack_sockaddr_in get_peername
      send_datagram(data.to_json, host, port)
      end_time = Time.current

      t3_data = {}
      t3_data["id"] = data["id"]
      t3_data["subsequence"] = true
      t3_data["t3"] = self.get_timestamp(end_time)



      send_datagram(t3_data.to_json, host, port)

    rescue JSON::ParserError => e
      p 'invalid json format'
    end
  end

  def self.run
    Process.daemon true, true

    EM::run do
      p "start"
      EM::open_datagram_socket(@@host, @@port, self)
    end
  end
end

if __FILE__ == $0
  UDPServer.run()

end

