<?php
require "databaseConfig.php";

class database
{
    public $connect;
    public $data;
    private $sql;
    protected $servername;
    protected $username;
    protected $password;
    protected $databasename;

    public function __construct()
    {
        $this->connect = null;
        $this->data = null;
        $this->sql = null;
        $dbc = new databaseConfig();
        $this->servername = $dbc->servername;
        $this->username = $dbc->username;
        $this->password = $dbc->password;
        $this->databasename = $dbc->databasename;
    }

    function dbConnect()
    {
        $this->connect = mysqli_connect($this->servername, $this->username, $this->password, $this->databasename);
        return $this->connect;
    }

    function prepareData($data)
    {
        return mysqli_real_escape_string($this->connect, stripslashes(htmlspecialchars($data)));
    }

    function signUp($table, $ic, $email, $password, $role)
    {
        $ic = $this->prepareData($ic);
        $password = $this->prepareData($password);
        $email = $this->prepareData($email);
        $password = password_hash($password, PASSWORD_DEFAULT);
        $role = $this->prepareData($role);

        $this->sql =
            "INSERT INTO " . $table . " (ic, password, email, role) VALUES ('" . $ic . "','" . $password . "','" . $email . "','" . $role . "')";
        if (mysqli_query($this->connect, $this->sql)) {
            return true;
        } else return false;
    }

    
    function logIn($table, $email, $password)
    {
        $email = $this->prepareData($email);
        $password = $this->prepareData($password);

        $this->sql = "select * from " . $table . " where email = '" . $email . "'";

        $result = mysqli_query($this->connect, $this->sql);
        $row = mysqli_fetch_assoc($result);
        if (mysqli_num_rows($result) != 0) {
            $dbemail = $row['email'];
            $dbpassword = $row['password'];
            if ($dbemail == $email && password_verify($password, $dbpassword)) {
                $login = true;
            } else $login = false;
        } else $login = false;

        return $login;
    }


    function getHealthcare()
    {
        $this->sql = "SELECT * FROM 'healthcare'";

        if(!$this->dbConnect()){
            echo "Error connecting to Database";
        }else{
            $this->connect = mysqli_connect('localhost', 'root','', 'bsdb');
            $result = $mysqli->query($this->connect, $this->sql);
        
            if ($result->num_rows() > 0) {

                $return_arr['healthcare'] = array();

                while ($row = $result->fetch_array()){
                    array_push($return_arr['healthcare'], array( 
                        'name'=>$row['name']
                    ));
                   
                }
                
                echo json_encode($return_arr);

            }
        
            
        }

    }
}
?>
