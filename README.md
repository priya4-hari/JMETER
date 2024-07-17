
<h1>JMETER</h1>
<p>APACHE JM <img src="https://jmeter.apache.org/images/favicon.png" width="30" height="30"> is an open source , Load and Performance testing tool.<br>
<p> JMeter is a Java <img src="https://cdn.worldvectorlogo.com/logos/java.svg" alt="Java" width="20" height="20">    based Application.</p>
<p>JMeter is used to test peformance of the web Application under the load and stress.</p>  
<p>JMeter is Synchronous, Thread based and Script execution Engine.</p>
<p>Web Application:</p>


<h3>Components of JMeter:-</h3>
  <li>Thread Group</li>
  <li>Configuration elements</li>  
  <li>Listener</li>
  <li>Timers</li>
  <li>Pre processors</li>
  <li>Post processors</li>
  <li>Assertions</li>
  <li>Test Fragment</li>
  <li>Non-Test Elements</li>

<h4>Thread Groups</h4>
<ul>
  <p>Thread Groups are Group of the threads that are executing the same scenario.</p>
</ul>
  <p>Thread Groups contains elements like:</p>
    <p>1.name</p>
    <p>2.comments</p>
    <p>3.Action to be taken after sample error</p>
      <ul style="list-style-type:circle">
          <li>Continue</li>
          <li>start next thread loop</li>
          <li>stop thread</li>
          <li>stop test</li>
          <li>stop test now</li>
      </ul>
      <p>4.Thread Properties</p>
        <ul>
          <li>Number of thread(users)</li>
          <li>Ramp-up period(seconds)</li>
          <li>Loop count</li>
          <ul>
            <li>Same users on each iteration</li>
            <li>Delay thread creation intill needed</li>
            <li>Specify thread lifetime</li>
          </ul>
          <li>Duration(Seconds)</li>
          <li>Startup Delay(Seconds)</li>
        </ul>
