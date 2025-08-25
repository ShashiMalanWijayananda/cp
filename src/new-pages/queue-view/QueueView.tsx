import React, { FC } from 'react';
import Queue from './queue/Queue';
import GlobalFooter from '../../components/GlobalFooter/GlobalFooter';
import './QueueView.css';

const QueueView: FC = () => {
  return (
    <>
      {/* Page heading (colors/sizes come from your global tokens) */}

      {/* Main page container (sits inside AppLayout Outlet) */}
      <main className="queue-page-container" role="main">
        <div className="queue-page-heading">
          <h1>Mission Access Queue</h1>
        </div>
        <section className="queue-content-main">
          <div className="queue-content-wrapper">
            {/* Queue Component */}
            <div className="queue-component-container">
              <Queue />
            </div>
          </div>
        </section>
      </main>

      {/* Global scrolling footer message */}
      <GlobalFooter text="**** STAY IN QUEUE UNTIL YOUR TURN **** YOU WILL BE REDIRECTED TO TICKET PURCHASE AUTOMATICALLY **** " />
    </>
  );
};

export default QueueView;
