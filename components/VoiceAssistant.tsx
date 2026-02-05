import React, { useState } from 'react';
import { DashboardMetrics, Lead } from '../types';

interface VoiceAssistantProps {
  currentTime: Date;
  metrics: {
    today: DashboardMetrics;
    yesterday: DashboardMetrics;
    mtd
