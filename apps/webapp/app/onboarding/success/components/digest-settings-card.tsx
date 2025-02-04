"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Mail, MessageCircle } from "lucide-react";
import { hebrewContent } from "@/locales/he";
import { UserInfo } from "../types";

const { success } = hebrewContent.onboarding.steps;

export function DigestSettingsCard({ userInfo }: { userInfo: UserInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-xl border shadow-sm p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-base font-semibold">{success.settings}</h3>
      </div>

      <div className="grid gap-3">
        {userInfo.digestTime && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-muted/50 p-3 rounded-lg flex items-center gap-3"
          >
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">שעת המשלוח</p>
              <p className="font-medium">{userInfo.digestTime}</p>
            </div>
          </motion.div>
        )}

        {userInfo.digestChannel && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-muted/50 p-3 rounded-lg flex items-center gap-3"
          >
            {userInfo.digestChannel === "email" ? (
              <Mail className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <MessageCircle className="h-4 w-4 text-primary shrink-0" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">ערוץ המשלוח</p>
              <p className="font-medium">
                {userInfo.digestChannel === "email" ? "אימייל" : "ווטסאפ"}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
