import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from "react-router";
import './index.css'
import NavbarWrapper from './NavbarWrapper';
import Home from './Home';
import PanelAggregator from './panel/PanelAggregator';
import './font.ts';
import { UnifiedStaticDataProvider } from './lib/unifiedStaticData.tsx';
import { isValidated } from './lib/networking/firebase.ts';
import { FeedManagerProvider } from './lib/feedManager.tsx';
import TaskAdder from './TaskAdder.tsx';
import NotFound from './NotFound.tsx';
import AuthWrapper from './auth/AuthWrapper.tsx';
import Account from './Account.tsx';
import AdminGate from './admin/AdminGate.tsx';
import DeviceAuth from './admin/DeviceAuth.tsx';
import Admin from './admin/Admin.tsx';
import QuickUpdate from './QuickUpdate.tsx';
import UnifiedStaticDataUpdater from './USD_Updater.tsx';
import UnifiedStaticDataCreator from './admin/USD_Creator.tsx';
import FullUpdate from './FullUpdate.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isValidated ? (
      <UnifiedStaticDataProvider>
        <AuthWrapper>
          <FeedManagerProvider>
            <HashRouter>
              <Routes>
                <Route path='*' element={<NotFound />} />
                <Route element={<NavbarWrapper />}>
                  <Route path="/addTask" element={<TaskAdder />}/>
                  <Route path="/account" element={<Account />}/>
                  <Route path="/update" element={<QuickUpdate />}/>
                  <Route path="/fullUpdate" element={<FullUpdate />}/>
                  <Route path="/USD_Patcher" element={<UnifiedStaticDataUpdater />}/>
                  <Route path="/admin" element={<AdminGate />}>
                    <Route path="" element={<Admin />}/>
                    <Route path="deviceAuth" element={<DeviceAuth />}/>
                    <Route path="USD_Creator" element={<UnifiedStaticDataCreator />}/>
                  </Route>
                </Route>
                <Route path="/" element={<Home />}/>
                <Route path="/livefeed" element={<PanelAggregator />}/>
              </Routes>
            </HashRouter>
          </FeedManagerProvider>
        </AuthWrapper>
      </UnifiedStaticDataProvider>
    ) : (
      <h1 className="m-auto text-3xl p-32 leading-8">
        You need to setup firebase to use this project<br/>
        Contact SGOTI2 on 1511 for more details<br/>
        <small className="text-base">Sorry, I don't want everybody using up my free quota :(</small><br/>
        <small className="text-xs text-gray-600">Remember to reload the vite server</small></h1>
    )}
  </StrictMode>
)
